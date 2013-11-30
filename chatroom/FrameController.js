/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Appends message objects to iFrame

//Top of the next message
var maxY = 20;
var DEFAULT_HEIGHT = 15;

var frame;
var HEIGHT;

//Pass a message object
function drawMessage(message){
    var text = frame.contentDocument.createElement('h4');
    text.classList.add("message");
    text.innerHTML = message.name + " : " + message.message + "<br>";
    
    if (message.name == "Server"){
        text.style.fontStyle = "italic";
        text.style.margin = "2px 5px";
        text.innerHTML = "(" + message.date + ") " + message.name + " : " + message.message + "<br>";
    }
    frame.contentDocument.body.appendChild(text);
}

function initFrame(){
    console.log("iFrame initialized");
    frame = document.getElementById("chatFrame");
}