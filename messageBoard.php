<?php
//This file handles POST requests

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': 
        echo "Illegal Access! Use the form at www.michaelman.net to post to the message board.";             break;
    case 'POST': 
        writeToFile($_POST['name'], $_POST['message']);
    /*foreach ($_POST as $key => $value){
        echo $key . " -> " . $value . "\n";
    }*/
        echo ("Message posted successfully!"); 
        break;
}
    
    function writeToFile($name, $message){
        $file = "messages.txt";
        $fh = fopen($file, 'a');
        //Prevents injection
        $data = htmlspecialchars("\n" . $name . " (" . date('m-d-Y') . ") : " . $message);
        fwrite($fh, $data);
        fclose($fh);
    }
?>