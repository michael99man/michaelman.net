/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */


//Creates the messageboard element on Index.html

//Posts a message to the board with AJAX, then repaints the document
function postMessage(){
    var name = document.getElementById("messageForm").elements.name.value;
    var message = document.getElementById("messageForm").elements.message.value;

     //Illegal chars 
    name = name.replace('(', '');
    name = name.replace(')', '');
    name = name.replace(':', '');
    message = message.replace('(', '');
    message = message.replace(')', '');
    message = message.replace(':', '');
    
    if (name === "" || message === ""){
        return;
    }
    
    var params = "name=" + encodeURIComponent(name) + "&message=" + encodeURIComponent(message);
    document.getElementById("messageForm").elements.name.value = "";
    document.getElementById("messageForm").elements.message.value = "";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "messageBoard.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(params);
    
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            alert(xmlhttp.responseText);
        }  
    };
    
    //getData();
}

function getData(){
    //AJAX
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            drawPosts(xmlhttp);
        }
    };
    xmlhttp.open("GET","messages.txt?" + Math.random(),true);
    xmlhttp.send();
}

function drawPosts(response){
    var text = response.responseText + "";
    
    var dataArray = [];
    //Array of lines
    var arrLines = text.split("\n");
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        
        var dateOffset = curLine.indexOf("(");
        var dateOffsetTwo = curLine.indexOf(")");
        var offset = curLine.indexOf(" : ");
        
        var date = curLine.substring(dateOffset+1, dateOffsetTwo);
        var name = curLine.substring(0, dateOffset - 1);
        var message = curLine.substring(offset + 3);
        
        //NOTE: SUBSTRING INCLUDES START BUT NOT END. e.g. (1,4) of "hello" is "ell"
        var data = {name: name, message: message, date : date};
        dataArray.push(data);
        alert(name + " at " + date + " : " + message);
    }   
    
    for (var x = 0; x<dataArray.length; x++){
        
    }
}