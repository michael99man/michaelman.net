<?php
//This file handles POST requests
//EST
date_default_timezone_set('America/New_York');

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': 
    echo "Illegal Access! Use the form at www.michaelman.net to post to the message board.";             break;
    case 'POST': 
    if (checkIfBanned($_SERVER['REMOTE_ADDR'])){
        echo ("Your IP has been banned! Contact Michael for more info."); 
    } else {
        writeToFile($_POST['name'], $_POST['message'], $_SERVER['REMOTE_ADDR']);
            echo ("Message posted successfully!"); 
    }
    break;
}

function writeToFile($name, $message, $IP){
    $file = "messages.txt";
    $fh = fopen($file, 'a');
    //Prevents injection
    $data = htmlspecialchars("\n" . $name . " (" . date('m-d-Y') . ") : " . $message . " ^" . $IP . "^");
    fwrite($fh, $data);
    fclose($fh);
}

function checkIfBanned($IP){
    $fh = fopen("Banlist.txt", 'r');
    $data = fread($fh, filesize("Banlist.txt"));
    fclose($fh);
    
    $lines = explode("\n", $data);
    foreach ($lines as $line){
        if ($IP == $line){
            //Is banned!
            return true;
        }
    }
    //Not banned!
    return false;
}

?>