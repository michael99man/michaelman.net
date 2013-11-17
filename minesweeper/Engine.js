/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var WIDTH_MAX;
var HEIGHT_MAX;
var TOTAL_BLOCKS;

var blockList = [];

var Canvas;
var ctx;
var BLOCK_SIZE = 25;

var MINE_TOTAL = 25;

//SPRITES:
var MINE_IMG = new Image();
var BLOCK_IMG = new Image();

//Numbers 1-8
var ONE_IMG = new Image();
var TWO_IMG = new Image();
var THREE_IMG = new Image();
var FOUR_IMG = new Image();
var FIVE_IMG = new Image();
var SIX_IMG = new Image();
var SEVEN_IMG = new Image();
var EIGHT_IMG = new Image();

var IMG_LIST = [ONE_IMG, TWO_IMG, THREE_IMG, FOUR_IMG, FIVE_IMG, SIX_IMG, SEVEN_IMG, EIGHT_IMG];

//Setting source
MINE_IMG.src = "sprites/mine.png";
BLOCK_IMG.src = "sprites/block.png";

ONE_IMG.src = "sprites/numbers/one.png";
TWO_IMG.src = "sprites/numbers/two.png";
THREE_IMG.src = "sprites/numbers/three.png";
FOUR_IMG.src = "sprites/numbers/four.png";

//TO BE COMPLETED
FIVE_IMG.src = "sprites/numbers/one.png";
SIX_IMG.src = "sprites/numbers/one.png";
SEVEN_IMG.src = "sprites/numbers/one.png";
EIGHT_IMG.src = "sprites/numbers/one.png";


//Draws the gamezone
function drawGame(){
    var id = 0;
    for (var i = 0; i<WIDTH_MAX; i++){
        for (var j = 0; j<HEIGHT_MAX; j++){
            var block = {x: i, y: j, w: BLOCK_SIZE, h: BLOCK_SIZE, 'id': id, revealed: false, type : null}; 
            blockList.push(block);
            ctx.drawImage(BLOCK_IMG, i * BLOCK_SIZE,j * BLOCK_SIZE);
            id++;
        }
    }
    
    //Randomly plants mines
    for (var p = 0; p<MINE_TOTAL; p++){
        var valid = false;
        
        while (!valid){
            //Generates random number from 0 - (TOTAL_BLOCKS - 1)
            var num = Math.floor((Math.random()*TOTAL_BLOCKS)+1);
            if (blockList[num].type !== "mine"){
                valid = true;
                blockList[num].type = "mine";
                ctx.drawImage(MINE_IMG, blockList[num].x * BLOCK_SIZE, blockList[num].y * BLOCK_SIZE);
                break;
            }
        }
    }
    
    for(var f = 0; f<blockList.length; f++){
        if (blockList[f].type === null){
            var amount = getAdjacent(blockList[f].id);
            //Set sprite based on amount
            if (amount !== 0){
                blockList[f].type = amount;
            }
        }
    }
}

//Returns the number of mines adjacent to this point
function getAdjacent(id){
    var mines = 0;
    
    //List of IDs that are adjacent to this point:
    var idList = [id-HEIGHT_MAX-1, id-HEIGHT_MAX, id-HEIGHT_MAX+1, id-1, id+1, id+HEIGHT_MAX-1, id+HEIGHT_MAX, id+HEIGHT_MAX+1];
    
    for (var i = 0; i<idList.length; i++){
        if (blockList[idList[i]] !== undefined){
            if (blockList[idList[i]].type == "mine"){ 
                mines++;
            }
        }
    }
    return mines;
}

function click(e){
    var x,y;
    if (e.pageX || e.pageY) { 
        x = e.pageX;
        y = e.pageY;
    }
    else { 
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= Canvas.offsetLeft;
    y -= Canvas.offsetTop;
    
    var xDiv = Math.floor(x * 1.0 / BLOCK_SIZE);
    var yDiv = Math.floor(y * 1.0 / BLOCK_SIZE);
    //alert(xDiv + ", " + yDiv);
    
    var id;
    for (var i = 0; i < blockList.length; i++){
        if (blockList[i].x == xDiv && blockList[i].y == yDiv){
            id = blockList[i].id;
            break;
        } 
    }
    processClick(id, e);
}

function processClick(id, event){
    var clickType;    
    if(event.which == 1){
        clickType = "left";
    } else if (event.which == 2){
        clickType = "middle";
    } else if (event.which == 3){
        clickType = "right";
    } else {
        clickType = "Error";
    }
    
    //alert("Block " + id + " was clicked with: " + clickType);
    
    //ON FIRST CLICK: THE CLICKED BLOCK IS A NULL
    if (!blockList[id].revealed && clickType){
        var type = blockList[id].type;
        reveal(id);
        if (type == "mine"){
            if (clickType == "left"){
                //WIP
                //revealAll();
                alert("Game over!");
                //gameOver();
            } else if (clickType == "right"){
                //FLAG(id);
            }
        } else if (type === null){
            var idList = [id];
            revealNull(idList);
        }
    }
}


//Reveals all the neighbors of the null block until you reach a number block. Iterates for each other null block revealed this way 
function revealNull(start){
    var items = [start];   
    function enqueue(array){
        var included = false;
        for (var a=0; a<array.length; a++){
            for (var id = 0; id< items.length; id++){
                if (items[id] == array[a]){
                    included = true;
                }
            }
            if(!included) {
                items.push(array[a]);    
            }
        }
    }
    
    function dequeue() {
        return items.shift();                                                
    }
    function peek(){
        return items[0];
    }
    
    while(peek !== undefined){
        enqueue(revealAdj(dequeue()));
    }
    
    function revealAdj(id){
        var revealedNulls = [];
        //Array of blocks sharing a side
        var adjacentBlocks = [id - HEIGHT_MAX, id - 1, id + 1, id + HEIGHT_MAX];
        for (var i = 0; i<adjacentBlocks.length; i++){
            var x = adjacentBlocks[i];
            if (blockList[x] !== undefined){
                if (blockList[x].type === null){
                    reveal(x);
                    revealedNulls.push(x);
                } else if (blockList[x].type !== "mine"){ //Reveals the number
                    reveal(x);
                }
            }
        }
        return revealedNulls;
    }
}


//Reveals a block
function reveal(id){
    ctx.clearRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    if (blockList[id].type === null){
        ctx.strokeRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    } else if (blockList[id].type == "mine"){
        ctx.drawImage(MINE_IMG, blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    } else {
        ctx.drawImage(IMG_LIST[blockList[id].type - 1], blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    }
    blockList[id].revealed = true;
}

function init(){
    Canvas = document.getElementById("Canvas");
    CANVAS_WIDTH = Canvas.width;
    CANVAS_HEIGHT = Canvas.height;
    
    WIDTH_MAX = CANVAS_WIDTH/BLOCK_SIZE;
    HEIGHT_MAX = CANVAS_HEIGHT/BLOCK_SIZE;
    TOTAL_BLOCKS = WIDTH_MAX * HEIGHT_MAX;
    ctx = Canvas.getContext("2d");
    //16*18
    //alert(w + "*" + h);
    
    Canvas.addEventListener('click', click, false);
    
    //Call last to avoid errors:
    drawGame();
}


function clear(x,y){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
}