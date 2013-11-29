/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Paints the canvas and takes care of it!

//Top of the next message
var maxY = 20;

var canvas;
var ctx;

//Pass a message object
function drawMessage(message){
    ctx = canvas.getContext("2d");
    ctx.font = "15px italic Tahoma";
    ctx.fillStyle("#000")
    ctx.fillText(message.name + " : " + message.message, 10, maxY);
    maxY += 30;
}

function initCanvas(){
    alert("Canvas initialized");
    canvas = document.getElementById("chatCanvas");
}