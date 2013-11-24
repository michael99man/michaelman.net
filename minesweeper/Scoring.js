/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Role: To parse and write to text file to save data
//Also must construct the table as well as sort the list

var dataArray = [];

function drawTable(dataArray){
    var myTable = "<table border = \"2\"><tr><td style='width: 50px; color: black;'>Ranking</td><td style='width: 200px; color: black;'>Name</td><td style='width: 200px; color:                black;'>Score (seconds)</td></tr>";
    for (var i = 0; i<dataArray.length; i++){
        if (i !== 0 && dataArray[i].score == dataArray[i-1].score){
            myTable += "<tr><td>" + (i) + "</td><td>";
        } else {
            myTable += "<tr><td>" + (i+1) + "</td><td>";
        }
        myTable += dataArray[i].name + "</td><td>" + dataArray[i].score + "</td></tr>";
    }
    document.getElementById("table").innerHTML = myTable;
}


//Custom sorting algorithm
function sortArray(data){
    var newArray = [];
    for(var i = 0; i<data.length; i++){
        if (i===0){
            newArray.push(data[0]);
        } else {
            var inserted = false;
            for (var j = 0; j<newArray.length; j++){
                //Less is better!
                if (data[i].score <= newArray[j].score){
                    newArray.splice(j, 0, data[i]);
                    inserted = true;
                    break;
                }
            }
            if (!inserted){
                newArray.push(data[i]);
            }
        }
    }
    return newArray;
}

//Returns a random string of length 5
function generateRandom(){
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = "";
    for( var i=0; i <5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * (possible.length-1)));
    }
    return text;
}

function LoadFile(){
    //AJAX
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            parseData(xmlhttp);
        }
    };
    xmlhttp.open("GET","scores.txt?" + generateRandom(),true);
    xmlhttp.send();
    
    /*
    document.getElementById("frmFile").src = ("scores.txt?" + text);
    alert("PULLING FROM " + document.getElementById("frmFile").src);
    var strRawContents =document.getElementById("frmFile").contentWindow.document.body.childNodes[0].innerHTML;
    document.getElementById("frmFile").contentDocument.location.reload(true);
    */
}

function parseData(res){
    var text = res.responseText + "";
    
    dataArray = [];
    //Array of lines
    var arrLines = text.split("\n");
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        var offset = curLine.indexOf(" : ");
        var name = curLine.substring(0, offset);
        var score = parseInt(curLine.substring(offset + 3), null);
        //NOTE: SUBSTRING INCLUDES START BUT NOT END. e.g. (1,4) of "hello" is "ell"
        var data = {name: name, score: score};
        dataArray.push(data);
        //alert(name + " scored " + score);
    }   
    dataArray = sortArray(dataArray);
    drawTable(dataArray);
}


//TODO: Use AJAX to simplify!
function postScore(){
    var name = document.getElementById("HighScoreForm").elements.name.value;
    var score = TIME;
    //alert("POSTING: " + name + " - " + score);
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "http://michaelman.net/minesweeper/scores.php");
    
    var nameField = document.createElement("input");
    nameField.setAttribute("type", "hidden");
    nameField.setAttribute("name", "name");
    nameField.setAttribute("value", name);
    
    var scoreField = document.createElement("input");
    scoreField.setAttribute("type", "hidden");
    scoreField.setAttribute("name", "score");
    scoreField.setAttribute("value", score);
    
    form.appendChild(nameField);
    form.appendChild(scoreField);
    document.body.appendChild(form);
    form.submit();
}