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



//Draws the gamezone
function drawGame(){
    var id = 1;
    for (var i = 0; i<WIDTH_MAX; i++){
        for (var j = 0; j<HEIGHT_MAX; j++){
            var block = {x: i, y: j, w: BLOCK_SIZE, h: BLOCK_SIZE, 'id': id, revealed: false, type : undefined}; 
            blockList.push(block);
            ctx.strokeRect(i * BLOCK_SIZE,j * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            id++;
        }
    }
    
    var MINE_IMG = new Image();
    MINE_IMG.src = "sprites/mine.png";
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
}

//Returns the number of mines adjacent to this point
function getAdjacent(id){
    
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
        } else {
            //alert(blockList[i].x + " !== " + xDiv + " OR " + blockList[i].y + " !== " + yDiv);
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
    
    alert("Block " + id + " was clicked with: " + clickType);
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
    drawGame();
    
    Canvas.addEventListener('click', click, false);
}


function clear(x,y){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
}