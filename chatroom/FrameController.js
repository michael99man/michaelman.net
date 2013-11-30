/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Appends message objects to iFrame

//Top of the next message
var maxY = 20;
var DEFAULT_HEIGHT = 15;

var frame;
var HEIGHT;

//Pass a message object
function drawMessage(message){
    var newElement = frame.contentDocument.createElement('div');
    newElement.innerHTML = "<div class = \"message\">" + message.message + "</div>";
    frame.contentDocument.body.appendChild(newElement);
}

function initFrame(){
    console.log("iFrame initialized");
    frame = document.getElementById("chatFrame");
}