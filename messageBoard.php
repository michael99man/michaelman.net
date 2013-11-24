<?php
//This file handles POST requests

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': $the_request = &$_GET; echo "Illegal Access! Use the form at www.michaelman.net to post to the   message board."; break;
    case 'POST': $the_request = &$_POST; 
    writeToFile($_POST['name'], $_POST['messsage']);
    /*foreach ($_POST as $key => $value){
        echo $key . " -> " . $value . "\n";
    }*/
    echo ("Message posted successfully!"); 
    break;
}
    
    function writeToFile($name, $message){
        $file = "messages.txt";
        $fh = fopen($file, 'a');
        $data = "\n" . $name . " (" . date('m-d-Y') . ") : " . $score;
        fwrite($fh, $data);
        fclose($fh);
    }
?>