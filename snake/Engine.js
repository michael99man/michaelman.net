/*jslint browser:true, white: true, plusplus: true, maxerr:1000 */

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
        
        if (block.x == FRUIT_X && block.y == FRUIT_Y){
            gotIt = true;
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
        
        for (var j = 0; j<blockList.length; j++){
            if (block.x == blockList[j].x && block.y == blockList[j].y && j != i){
                gameOver();
                break;
            }
        }
        
        draw(block.x * BLOCK_SIZE, block.y * BLOCK_SIZE);   
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
}

//Initializes
function welcomeScreen(){
    Canvas = document.getElementById("Canvas");
    ctx = Canvas.getContext("2d");
    CANVAS_WIDTH = Canvas.width;
    CANVAS_HEIGHT = Canvas.height;
    
    //Adds a listener to the document
    document.addEventListener("keypress", processInput, false);
    
    LENGTH_MAX = CANVAS_WIDTH/BLOCK_SIZE;    
    HEIGHT_MAX = CANVAS_HEIGHT/BLOCK_SIZE;
    
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = "bold 40px Impact";
    ctx.fillText("Welcome to my version of Snake!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 100);
    
    ctx.font = "italic 20px Impact";
    ctx.fillText("Controls: WASD", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 20);
    ctx.fillText("Press enter to begin!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
}


//Draws a snake block
function draw(x, y) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(x,y,BLOCK_SIZE,BLOCK_SIZE);
}

function clear(x,y){
    ctx.clearRect(x,y, BLOCK_SIZE, BLOCK_SIZE);
}

function processInput(key){
    var keyCode = key.keyCode;
    
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
        } else {
            if (WELCOME_SCREEN){
                alert("Press Enter to Begin");
                key.preventDefault();
            }
        }
    } else {  
        if (keyCode == 119){
            changeDirection("Up");
        } else if (keyCode == 115){
            changeDirection("Down");
        } else if (keyCode == 97){
            changeDirection("Left");
        } else if (keyCode == 100){
            changeDirection("Right");
        } else {
            alert("Control the snake with W-A-S-D!");
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
    ctx.fillStyle = "CC0033";
    ctx.textAlign = "center";
    ctx.font = "bold 50px Impact";
    ctx.fillText("GAME OVER!", CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 35);
    
    ctx.font = "italic 40px Impact";
    ctx.fillText("Final Score: " + SCORE, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    window.clearInterval(paintID);
    GAME_OVER = true;
    document.getElementById("ScoreDisplay").innerHTML = "Your Score: " + SCORE;
    document.getElementById("PostButton").disabled = false;
    document.getElementById("nameField").disabled = false;
}
