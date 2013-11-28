<?php
//THIS FILE HANDLES IO

switch($_SERVER['REQUEST_METHOD'])
{
case 'GET': 
    echo readFromFile();
    break;
case 'POST':
    $data = writeToFile($_POST['name'], $_POST['message']);
    //Used to tell client that the message has been sent
    echo ("Success: " + $data); 
    break;
}
    
    function writeToFile($name, $score){
        $file = "scores.txt";
        $fh = fopen($file, 'a');
        $data = "\n" . $name . " : " . $score;
        fwrite($fh, $data);
        fclose($fh);
        return $data;
    }

    function readFromFile(){
        $file = "messages.txt";
        $fh = fopen($file, 'a');
        $data = "\n" . $name . " (" . date('m-d-Y') . ") : " . $message;
        fwrite($fh, $data);
        fclose($fh);
    }
?>