/*jslint browser:true, white: true, plusplus: true, maxerr:1000, devel: true*/


var initialized = false;
var Canvas;
var ctx;

var fps = 60;

//Holds the interval for painting the canvas - to be used when stopping
var paintID;

var frameCounter = 0;
var seconds = 0;
var SCORE = 0;
var lastLoop;
var thisLoop;
var tempFPS = 0;
var blockList = [];
var DEFAULT_DIRECTION = "Right";

//The width/height of each block
var BLOCK_SIZE = 25;

var CANVAS_WIDTH;
var CANVAS_HEIGHT;


//The amount of blocks that can horizontally
var LENGTH_MAX;

//The amount of blocks that can vertically
var HEIGHT_MAX;


//Fruit Coordinates
var FRUIT_X, FRUIT_Y;

//STATES:
var GAME_OVER = false;
var WELCOME_SCREEN = true;
var RAINBOW = false;

function update() {
    frameCounter+=1;
    if (!GAME_OVER){
        thisLoop = new Date();
        tempFPS = 1000 / (thisLoop - lastLoop);
        lastLoop = thisLoop;
        tempFPS = Math.round(tempFPS*10)/10;
        
        
        //Rendering blocks
        for (var i=0; i<blockList.length; i++){
            var block = blockList[i];
            draw(block.x * BLOCK_SIZE, block.y * BLOCK_SIZE);
            
            //When there's a fruit, draw it
            if (FRUIT_X && FRUIT_Y){
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(FRUIT_X * BLOCK_SIZE,FRUIT_Y * BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE); 
            }
        }
        
        if (frameCounter===5){
            frameCounter=0;
            seconds+=1;
            
            //Updates once per frameCounter frames
            moveBlocks();
        }
    }
}

function moveBlocks(){
    'use strict';
    var i, block, nextBlock;
    
    if(blockList.length === 0){
        return;
    }
    var gotIt = false;
    for (i = 0; i < blockList.length; i++){
        
        block = blockList[i];
        nextBlock = blockList[i+1];
        
        if(!!nextBlock) {
            nextBlock.pendingDirection = block.direction;
        }
        
        if(block.pendingDirection !== null) {
            block.direction = block.pendingDirection;
        }
        
        clear(block.x * BLOCK_SIZE, block.y * BLOCK_SIZE);
        
        if (block.direction == "Down"){
            block.y ++;
        } else if (block.direction == "Up"){
            block.y --;
        } else if (block.direction == "Left"){
            block.x --;
        } else if (block.direction == "Right"){
            block.x ++;
        } else {
            alert(block.direction);
        }
        
        if (block.x >= LENGTH_MAX){
            block.x -= LENGTH_MAX;
        } else if (block.x < 0){
            block.x+=LENGTH_MAX;
        } 
        
        if (block.y >= HEIGHT_MAX){
            block.y -= HEIGHT_MAX;
        } else if (block.y < 0){
            block.y += HEIGHT_MAX;
        }
        
        if (block.x == FRUIT_X && block.y == FRUIT_Y){
            gotIt = true;
        }
        draw(block.x * BLOCK_SIZE, block.y * BLOCK_SIZE);
        
        for (var j = 0; j<blockList.length; j++){
            if (block.x == blockList[j].x && block.y == blockList[j].y && j != i){
                gameOver();
                break;
            }
        }   
    }
    
    if (gotIt){
        SCORE += 1;
        //Updating score
        document.getElementById("SCORE").innerHTML = ("SCORE: " + SCORE);
        
        var d = blockList[blockList.length-1].direction;
        var x = blockList[blockList.length-1].x;
        var y = blockList[blockList.length-1].y;
        
        if (d == "Right"){
            x--;
        } else if (d == "Left"){
            x++;
        } else if (d == "Up"){
            y++;
        } else if (d == "Down"){
            y--;
        }
        newBlock(x,y,d);
        generateFruit();
    }
}

//Starts the game
function init(){
    blockList = [];
    lastLoop = new Date();
    paintID = window.setInterval(update, 1000/fps);
    //Clear the Canvas (in case this is being called when the game is in progress)
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    //Creates the Snake
    newBlock(4,0);
    newBlock(3,0);
    newBlock(2,0);
    newBlock(1,0);
    newBlock(0,0);
    generateFruit();
    initialized = true;
    SCORE = 0;
    document.getElementById("SCORE").innerHTML = ("SCORE: " + SCORE);
    document.getElementById("ScoreDisplay").innerHTML = "GAME IN PROGRESS";
    document.getElementById("PostButton").disabled = true;
    document.getElementById("nameField").disabled = true;
    document.getElementById("PostButton").style.color = "#CC0000";
}

//Initializes
function welcomeScreen(){
    console.log("Herro");
    Canvas = document.getElementById("Canvas");
    ctx = Canvas.getContext("2d");
    CANVAS_WIDTH = Canvas.width;
    CANVAS_HEIGHT = Canvas.height;
    
    //Adds a listener to the document
    document.addEventListener("keydown", processInput, false);
    
    //Prevents window scrolling
    window.addEventListener("keydown", function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    
    LENGTH_MAX = CANVAS_WIDTH/BLOCK_SIZE;    
    HEIGHT_MAX = CANVAS_HEIGHT/BLOCK_SIZE;
    
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "bold 40px Impact";
    ctx.fillText("Welcome to my version of Snake!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 100);
    
    ctx.font = "italic 20px Impact";
    ctx.fillText("Controls: WASD/Arrow Keys", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 20);
    ctx.fillText("Press enter to begin!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
}


//Draws a snake block
function draw(x, y) {
    if (RAINBOW){
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        ctx.fillStyle = color;
    } else {
        ctx.fillStyle = "#000000";
    }
    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
}

function clear(x,y){
    ctx.clearRect(x,y, BLOCK_SIZE, BLOCK_SIZE);
}

function processInput(event){
    var keyCode = event.keyCode;
    //Ignores keys when control/command is down (Enables keyboard shortcuts, right clicking etc)
    if (!event.ctrlKey && event.keyCode !== 91 && event.keyCode !== 93 && event.keyCode !== 224){
        if(GAME_OVER || WELCOME_SCREEN){
            if (keyCode == 13){ 
                //Enter (starts and restarts game)
                
                if(WELCOME_SCREEN){
                    WELCOME_SCREEN = false;
                } 
                if (GAME_OVER){
                    GAME_OVER = false;
                    SCORE=0;
                }
                init();
            } else if (WELCOME_SCREEN){
                    alert("Press Enter to Begin");
                    event.preventDefault();
            } else if (keyCode == 32){
                document.getElementById("nameField").value += " ";
            }
        } else {  
            if (keyCode == 119 || keyCode == 87 || keyCode == 38){
                changeDirection("Up");
            } else if (keyCode == 115 || keyCode == 83 || keyCode == 40){
                changeDirection("Down");
            } else if (keyCode == 97 || keyCode == 65 || keyCode == 37){
                changeDirection("Left");
            } else if (keyCode == 100 || keyCode == 68 || keyCode == 39){
                changeDirection("Right");
            } else if (keyCode == 82) {
                RAINBOW = RAINBOW ? false : true;
                alert(RAINBOW ? "RAINBOW MODE ACTIVATED!" : "Rainbow mode disabled!");
            } else {
                alert("Control the snake with W-A-S-D OR the arrow keys! (" + keyCode + ")");
            }
        }
    }
}

function changeDirection(direction){
    if(initialized){
        var lastDirection = blockList[0].direction;
        var valid = false;
        
        if (direction == "Up"){
            if(lastDirection != "Down"){
                valid = true;
            }
        } else if (direction == "Down"){
            if(lastDirection != "Up"){
                valid = true;
            }
        } else if (direction == "Left"){
            if(lastDirection != "Right"){
                valid = true;
            }
        } else if (direction == "Right"){
            if(lastDirection != "Left"){
                valid = true;
            }
        }  
        
        if (direction == lastDirection) { valid = false;}
        
        if (valid){
            blockList[0].pendingDirection = direction;
        }
    }
}
function newBlock(x, y){
    var d = DEFAULT_DIRECTION;
    if (arguments.length == 3){
        d = arguments[2];
    }
    
    var block = {'x': x, 'y' : y, 'direction' : d,
                 'pendingDirection': null};
    draw(x * BLOCK_SIZE,y * BLOCK_SIZE);
    blockList.push(block);
}

//Generates a fruit at a random block
function generateFruit(){
    var valid = false;
    var x = 0;
    var y = 0;
    while (!valid){
        valid = true;
        x = Math.floor((Math.random()*(LENGTH_MAX-1))+1);
        y = Math.floor((Math.random()*(HEIGHT_MAX-1))+1);
        
        for (var i = 0; i < blockList.length; i++){
            var block = blockList[i];
            if (x == block.x && y == block.y){
                valid = false;
            }
        }
    }
    FRUIT_X = x;
    FRUIT_Y = y;
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(x * BLOCK_SIZE,y * BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE); 
    //alert("GENERATED: " + FRUIT_X + ", " + FRUIT_Y);
}

function gameOver(){
    GAME_OVER = true;
    ctx.fillStyle = "CC0033";
    ctx.textAlign = "center";
    window.clearInterval(paintID);
    document.getElementById("ScoreDisplay").innerHTML = "Your Score: " + SCORE;
    
    //Paints the GAMEOVER message onto the canvas
    if (SCORE !== 0){
        ctx.font = "bold 90px Impact";
        ctx.fillText("GAME OVER!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 60);
        
        ctx.font = "italic 55px Impact";
        ctx.fillText("Final Score: " + SCORE, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        
        ctx.font = "italic 20px Impact";
        ctx.fillText("Don't forget to submit your score below!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 30);
        document.getElementById("PostButton").disabled = false;
        document.getElementById("nameField").disabled = false;
        document.getElementById("PostButton").style.color = "#008A2E";
    } else {
        ctx.font = "bold 120px Impact";
        ctx.fillText("YOU SUCK AT LIFE", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    }
}
