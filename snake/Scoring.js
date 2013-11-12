/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */
//Role: To parse and write to text file to save data
//Also must construct the table as well as sort the list

var dataArray = [{name: "Joe", score : -1},{name: "Bob", score : 69},{name: "Hitler", score : 1010011010}];
drawTable(dataArray);
drawTable(sortArray(dataArray));

function drawTable(dataArray){
    var myTable = "<table border = \"2\"><tr><td style='width: 50px; color: black;'>Ranking</td><td style='width: 200px; color: black;'>Name</td><td style='width: 200px; color:                black;'>Score</td></tr>";
    for (var i = 0; i<dataArray.length; i++){
        myTable += "<tr><td>" + (i+1) + "</td><td>" + dataArray[i].name + "</td><td>" + dataArray[i].score + "</td></tr>";
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
            for (var j = 0; j<newArray.length; j++){
                if (data[i].score > newArray[j].score){
                    newArray.splice(j, 0, data[i]);
                    break;
                }
            }
        }
    }
    return newArray;
}

function postScore(name, score){
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