/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
/* global name, messages, getData, console, alert, init */

var name = "";

function checkInput(e){
    if (!e) e = window.event;
    if (e.keyCode == '13'){
        send();
        return false;
    }
}

function send(){
    if (name == ""){
        alert("Set your name first!");
        return;
    }
    alert("Sending!");
    var message = document.getElementById("textField").value;
    document.getElementById("textField").value = "";
    //Illegal chars 
    
    message = message.replace('(', '');
    message = message.replace(')', '');
    message = message.replace(':', '');
    
    if (name === null || name === "" || message === ""){
        return;
    }
    var messageObject = {"name" : name, "message" : message, "date" : null};
    
    var params = "name=" + encodeURIComponent(name) + "&message=" + encodeURIComponent(message);
    document.getElementById("textField").value = "";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "Server.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var response = xmlhttp.responseText;
            //Message sent successfully
            //Get date data from response
            var date = response.substring(response.indexOf(": ") + 2);
            messageObject.date = date;
            messages.push(messageObject);
            drawMessage(messageObject);
            console.log("Posting sent message! (" + messageObject.message + ")");
        }  
    };
    console.log("SENDING: \"" + message + "\"");
    xmlhttp.send(params);   
}


function setName(){
    var temp = document.getElementById("nameBox").value;
    temp = temp.replace('(', '');
    temp = temp.replace(')', '');
    temp = temp.replace(':', '');
    
    if (temp !== ""){
        name = temp;
        alert("Name set to: " + name);
        document.getElementById("nameBox").value = "";
        init();
        updateView();
    }
}

function updateView(){   
    if (name !== ""){
        //Changes the div view to show that the name has been set
        var view = "<h3>Welcome, " + name + "<h3>";
        document.getElementById("nameArea").innerHTML = view;
    }
}
