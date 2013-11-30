/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Paints the canvas and takes care of it!

//Top of the next message
var maxY = 20;
var DEFAULT_HEIGHT = 15;

var canvas;
var HEIGHT;
var ctx;

//Pass a message object
function drawMessage(message){
    ctx = canvas.getContext("2d");
    ctx.font = "15px italic Tahoma";
    ctx.fillStyle = "#000"
    
    //If it would take up too much space, make the canvas larger
    if (maxY + DEFAULT_HEIGHT > HEIGHT){
        canvas.height += DEFAULT_HEIGHT;
        HEIGHT = canvas.height;
    }
    
    ctx.fillText(message.name + " : " + message.message, 10, maxY);
    maxY += DEFAULT_HEIGHT;
}

function initCanvas(){
    alert("Canvas initialized");
    canvas = document.getElementById("chatCanvas");
    HEIGHT = canvas.height;
}