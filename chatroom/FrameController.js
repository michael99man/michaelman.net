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
    var span = frame.contentDocument.createElement('span');
    if (message.name == name){
        span.innerHTML = "<span class=\"myMessage\">" + message.name + " : " + message.message + "</span>";
        newElement.innerHTML = "<div class = \"myMessageBox\">" + span.innerHTML + "</div>";
    } else if (message.name == "Server"){
        //Message from server!
        //Gray and centered!
    } else {
        span.innerHTML = "<span class=\"theirMessage\">" + message.name + " : " + message.message + "</span>";
        newElement.innerHTML = "<div class = \"theirMessageBox\">" + span.innerHTML + "</div><br><br>";
    }
    frame.contentDocument.body.appendChild(newElement);
}

function initFrame(){
    console.log("iFrame initialized");
    frame = document.getElementById("chatFrame");
}