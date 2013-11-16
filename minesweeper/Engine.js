/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */

var CANVAS_WIDTH;
var CANVAS_HEIGHT;

var blockList = [];

var Canvas;
var ctx;
var BLOCK_SIZE = 25;

function welcomeScreen(){
    drawTable();
}



//Draws the gamezone
function drawGame(){
    for (var i = 0; i<CANVAS_WIDTH; i+= BLOCK_SIZE){
        for (var j = 0; j<CANVAS_HEIGHT; j+= BLOCK_SIZE){
            var block = {x: i, y: j, w: BLOCK_SIZE, h: BLOCK_SIZE};
            blockList.push(block);
            ctx.strokeRect(i,j, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}


function click(e){
    alert ("CLICKED AT" + e.clientX + ", " + e.clientY);
}

function init(){
    Canvas = document.getElementById("Canvas");
    CANVAS_WIDTH = Canvas.width;
    CANVAS_HEIGHT = Canvas.height;
    
    var w = CANVAS_WIDTH/BLOCK_SIZE;
    var h = CANVAS_HEIGHT/BLOCK_SIZE;
    ctx = Canvas.getContext("2d");
    //20*28
    alert(w + "*" + h);
    drawGame();
    
    Canvas.addEventListener('click', click, false);
}


function clear(x,y){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
}