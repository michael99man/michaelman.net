/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
/* global console, updateView, drawMessage */

//Not an actual thread
//Interval to pull from server

var messages = [];
var pullThread;

function init(){
    pullThread = setInterval(pull, 1000);
}

function pull(){
    console.log("Pulling!");
    //AJAX
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            //console.log("Received Data");
            parse(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET","log.txt?" + Math.random(),true);
    xmlhttp.send();
}

function parse(rawText){
    var arrLines = rawText.split("\n");
    var newLines = arrLines.splice(messages.length+1);
    if (newLines.length === 0 ){
        //console.log("NOTHING NEW");
    } else {
        //Paint the new messages and add them to messages
        for (var i = 0; i<newLines.length; i++){
            console.log("Parsing: " + newLines[i]);
            //TODO: Get date/time according to current timezone
            //Parse the message object || Current structure: \n name : message (**m-d-y h-i-s a**)
            var raw = newLines[i];
            var name = raw.substring(0, raw.indexOf(" : "));
            var message = raw.substring(raw.indexOf(" : ") + 3, raw.indexOf(" (**") - 1);
            var date = raw.substring(raw.indexOf(" (**") + 4, raw.indexOf("**)"));
            var messageObject = {"name" : name, "message" : message, "date" : date};
            console.log("Received : [" + messageObject.name + " : " + messageObject.message + " at " + messageObject.date + " ]");
            messages.push(messageObject);
            drawMessage(messageObject);
        }
    }
}