/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Role: To parse and write to text file to save data
//Also must construct the table as well as sort the list

var dataArray = [];

function drawTable(dataArray){
    var myTable = "<table border = \"2\"><tr><td style='width: 50px; color: black;'>Ranking</td><td style='width: 200px; color: black;'>Name</td><td style='width: 200px; color:                black;'>Score</td></tr>";
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
                if (data[i].score >= newArray[j].score){
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

function LoadFile(){
    var strRawContents = document.getElementById("frmFile").contentWindow.document.body.childNodes[0].innerHTML;
    dataArray = [];
    //Array of lines
    var arrLines = strRawContents.split("\n");
    //alert("File " + document.getElementById("frmFile").src + " has " + arrLines.length + " lines");
    for (var i = 0; i < arrLines.length; i++) {
        var curLine = arrLines[i];
        var offset = curLine.indexOf(" : ");
        var name = curLine.substring(0, offset);
        var score = parseInt(curLine.substring(offset + 3));
        //NOTE: SUBSTRING INCLUDES START BUT NOT END. e.g. (1,4) of "hello" is "ell"
        var data = {name: name, score: score};
        dataArray.push(data);
        //alert(name + " scored " + score);
    }   
    dataArray = sortArray(dataArray);
    drawTable(dataArray);
}

function postScore(){
    var name = document.getElementById("HighScoreForm").elements["name"].value;
    var score = SCORE;
    alert("POSTING: " + name + " - " + score);
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "http://michaelman.net/snake/scores.php");
    
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