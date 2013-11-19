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

var MINE_TOTAL = 35;

//SPRITES:
var MINE_IMG = document.createElement("img");
var BLOCK_IMG = document.createElement("img");
var CLICKED_MINE_IMG = document.createElement("img");

//Numbers 1-8
var ONE_IMG = document.createElement("img");
var TWO_IMG = document.createElement("img");
var THREE_IMG = document.createElement("img");
var FOUR_IMG = document.createElement("img");
var FIVE_IMG = document.createElement("img");
var SIX_IMG = document.createElement("img");
var SEVEN_IMG = document.createElement("img");
var EIGHT_IMG = document.createElement("img");
var FLAG_IMG = document.createElement("img");

var IMG_LIST = [ONE_IMG, TWO_IMG, THREE_IMG, FOUR_IMG, FIVE_IMG, SIX_IMG, SEVEN_IMG, EIGHT_IMG];

var MINE_COUNTER;

//Setting source
MINE_IMG.src = "sprites/mine.png";
BLOCK_IMG.src = "sprites/block.png";
FLAG_IMG.src = "sprites/flag.png";
CLICKED_MINE_IMG.src = "sprites/clickedmine.png";

ONE_IMG.src = "sprites/numbers/one.png";
TWO_IMG.src = "sprites/numbers/two.png";
THREE_IMG.src = "sprites/numbers/three.png";
FOUR_IMG.src = "sprites/numbers/four.png";

//TO BE COMPLETED
FIVE_IMG.src = "sprites/numbers/one.png";
SIX_IMG.src = "sprites/numbers/one.png";
SEVEN_IMG.src = "sprites/numbers/one.png";
EIGHT_IMG.src = "sprites/numbers/one.png";


var started = false;

var flaggedTotal = 0;

var GAME_OVER = false;

//Draws the gamezone
function drawGame(){
    var id = 0;
    for (var i = 0; i<WIDTH_MAX; i++){
        for (var j = 0; j<HEIGHT_MAX; j++){
            var block = {x: i, y: j, w: BLOCK_SIZE, h: BLOCK_SIZE, 'id': id, revealed: false, type : null , flagged: false}; 
            blockList.push(block);
            ctx.drawImage(BLOCK_IMG, i * BLOCK_SIZE,j * BLOCK_SIZE);
            id++;
        }
    }
}

//Generates the blockList
//Input: id coordinate of first click
function generateMap(id){
    var b = blockList[id];
    //To make sure that the click is on a null
    var noMine = [{x: b.x, y: b.y}, {x: b.x - 1 , y: b.y-1}, {x: b.x - 1 , y: b.y}, {x: b.x - 1 , y: b.y+1}, {x: b.x , y: b.y-1}, {x: b.x , y: b.y+1}, {x: b.x + 1 , y: b.y-1}, {x: b.x + 1 , y: b.y}, {x: b.x + 1 , y: b.y+1}];
    
    //Randomly plants mines
    for (var p = 0; p<MINE_TOTAL; p++){
        var valid = false;
        while (!valid){
            //Generates random number from 0 - (TOTAL_BLOCKS - 1)
            var num = Math.floor((Math.random()*(TOTAL_BLOCKS-1))+1);
            if (blockList[num].type !== "mine"){
                var allowed = true;
                for (var bl = 0; bl < noMine.length; bl++){
                    //If the mine would be placed adjacent to the initial click, reject it!
                    if (getBlock(noMine[bl].x, noMine[bl].y) == num){
                        allowed = false;
                    }
                }
                if (allowed){
                    valid = true;
                    blockList[num].type = "mine";
                    break;
                }
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
    revealNull(id);
}

//Returns the number of mines adjacent to this point
function getAdjacent(idn){
    var mines = 0;
    
    var b = blockList[idn];
    
    //List of IDs that are adjacent to this point:
    var coordList = [{x: b.x - 1 , y: b.y-1}, {x: b.x - 1 , y: b.y}, {x: b.x - 1 , y: b.y+1}, {x: b.x , y: b.y-1}, {x: b.x , y: b.y+1}, {x: b.x + 1 , y: b.y-1}, {x: b.x + 1 , y: b.y}, {x: b.x + 1 , y: b.y+1}];
    for (var i = 0; i < coordList.length; i++) {
        var id = getBlock(coordList[i].x, coordList[i].y);
        if (blockList[id] !== undefined) {
            if (blockList[id].type == "mine") {
                mines++;
            }
        }
    }        
    return mines;
}

//Returns the ID of the block at those coordinates
function getBlock(x,y){
    if (x > (WIDTH_MAX - 1) || x < 0 || y > (HEIGHT_MAX -1) || y<0){
        return -1;
    }
    
    var id = x*HEIGHT_MAX + y;
    return id;
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
    event.preventDefault();
    event.stopPropagation();
    processClick(id, e);
}

function processClick(id, event){
    if (GAME_OVER){
        return;
    }
    var clickType;    
    if(event.which == 1){
        //Mac support
        if (event.ctrlKey){
            clickType = "right";
        } else {
            clickType = "left";
        }
    } else if (event.which == 2){
        clickType = "middle";
    } else if (event.which == 3){
        clickType = "right";
    } else {
        clickType = "Error";
    }
    
    //alert("Block " + id + " was clicked with: " + clickType);
    
    //ON FIRST CLICK: THE CLICKED BLOCK IS A NULL
    if (!started){
        started = true;
        generateMap(id);
        return;
    }
    
    if (!blockList[id].revealed){
        //Checks only if the clicked block has not yet been revealed
        var t = blockList[id].type;
        if (clickType == "left"){
            if (t == "mine"){
                blockList[id].type = "clickedmine";
                gameOver();  
            } else if (t === null){
                revealNull(id);
            } else {
                //Number blocks
                reveal(id);
            }
        } else if (clickType == "right"){
            if (!blockList[id].flagged && flaggedTotal < MINE_TOTAL){
                flag(id);  
            } else {
                unflag(id);
            }
        } else {
            alert("Use left and right clicks to explore the board!");
        }
    }
}


//Reveals all the neighbors of the null block until you reach a number block. Iterates for each other null block revealed this way 
function revealNull(start){
    var items = [start]; 
    var revealList = [start];
    
    function enqueue(item){
        //Adds the item to the array if it's not included
        if(items.indexOf(item) == -1) {
            items.push(item); 
        }
    }
    
    function dequeue() {
        return items.shift();                                                
    }
    
    while(items.length > 0){
        revealAdj(dequeue());
    }
    //alert("DONE! Length of revealList: " + revealList.length);
    
    for (var b = 0; b<revealList.length; b++){
        if (!blockList[revealList[b]].revealed){
            reveal(revealList[b]);
        }
    }
    
    //Reveals the four blocks around a given null and returns the nulls revealed this way
    function revealAdj(d){
        var id = parseInt(d, 10);
        //Array of adjcacent blocks (sharing a corner or side)
        
        var b = blockList[id];
        //List of IDs that are adjacent to this point:
        var adjacentBlocks = [{x: b.x - 1 , y: b.y-1}, {x: b.x - 1 , y: b.y}, {x: b.x - 1 , y: b.y+1}, {x: b.x , y: b.y-1}, {x: b.x , y: b.y+1}, {x: b.x + 1 , y: b.y-1}, {x: b.x + 1 , y: b.y}, {x: b.x + 1 , y: b.y+1}];
        
        //Checks each adjacent block - If it's a null, reveal it and add it to the queue. If it's a number, just reveal it
        for (var i = 0; i<adjacentBlocks.length; i++){
            var x = adjacentBlocks[i].x;
            var y = adjacentBlocks[i].y;
            var index = getBlock(x,y);
            if (blockList[index] !== undefined){
                if (revealList.indexOf(index) == -1){
                    revealList.push(index);  
                    if (blockList[index].type === null && !blockList[index].revealed){
                        enqueue(index);
                    }
                }
            }
        }
    }
}

//Reveals a block
function reveal(id){
    ctx.clearRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    if (blockList[id].type === null){
        ctx.strokeRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    } else if (blockList[id].type == "mine"){
        ctx.drawImage(MINE_IMG, blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    } else if (blockList[id].type == "clickedmine"){
        ctx.drawImage(CLICKED_MINE_IMG, blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    }else {
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
    
    Canvas.addEventListener('contextmenu', click, false); 
    Canvas.addEventListener('click', click, false);
    
    MINE_COUNTER = document.getElementById("mineCounter");
    MINE_COUNTER.innerHTML="Mines left: " + MINE_TOTAL + "/" + MINE_TOTAL;
    //To avoid a blank canvas, draw canvas only after image has been loaded
    BLOCK_IMG.addEventListener('load', function() {
        drawGame();
    }, false);  
}

//Flags a block
function flag(id){
    blockList[id].flagged = true;
    ctx.clearRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.drawImage(FLAG_IMG, blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    flaggedTotal++;
    MINE_COUNTER.innerHTML = "Mines left: " + (MINE_TOTAL - flaggedTotal) + "/" + MINE_TOTAL;
    //Checks all of the player's flags. If they are correct, you win the game!
    if (flaggedTotal == MINE_TOTAL){
        var won = true;
        for (var b = 0; b<blockList.length; b++){
            if (blockList[b].flagged && blockList[b].type !== "mine"){
                won = false;
            }
        }
        if (won){
            winGame();
        }
    }
}

//Unflags a block
function unflag(id){
    blockList[id].flagged = false;
    ctx.clearRect(blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.drawImage(BLOCK_IMG, blockList[id].x * BLOCK_SIZE, blockList[id].y * BLOCK_SIZE);
    flaggedTotal--;
    MINE_COUNTER.innerHTML = "Mines left: " + (MINE_TOTAL - flaggedTotal) + "/" + MINE_TOTAL;
}

function winGame(){
    GAME_OVER = true;
    alert("YOU'VE WON THE GAME");
}

function gameOver(){
    GAME_OVER = true;
    for (var b = 0; b<blockList.length; b++){
        if (blockList[b].type == "mine" || blockList[b].type == "clickedmine"){
            reveal(b);
        }
    }
    ctx.fillStyle = "CC0033";
    ctx.textAlign = "center";
    ctx.font = "bold 80px Impact";
    ctx.fillText("GAME OVER!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 50);
}