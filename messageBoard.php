<?php
//This file handles POST requests

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': $the_request = &$_GET; echo "Illegal Access! Use the form at www.michaelman.net to access the   form."; break;
    case 'POST': $the_request = &$_POST; 
    writeToFile($_POST['name'], $_POST['messsage']);
    echo ("Saved: " . $_POST['name'] . " - " . $_POST['score']); break;
}
    
    function writeToFile($name, $message){
        $file = "messages.txt";
        $fh = fopen($file, 'a');
        $data = "\n" . $name . " (" . date . ") : " . $score;
        fwrite($fh, $data);
        fclose($fh);
    }
?>