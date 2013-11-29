<?php
//THIS FILE HANDLES IO

//EST
date_default_timezone_set('America/New_York');

switch($_SERVER['REQUEST_METHOD'])
{
case 'GET': 
    echo "Messages: <br><br>";
    $lines = explode("\n", readFromFile());
    foreach ($lines as $line){
        echo '&nbsp' . $line . "<br>";
    }
    break;
case 'POST':
    $data = writeToFile($_POST['name'], $_POST['message']);
    //Used to tell client that the message has been sent
    //Date is used to maintain consistency between Server and Client
    echo ("Received at: " . date('m-d-y h:i:s a')); 
    break;
}
    
    function writeToFile($name, $message){
        $file = "log.txt";
        $fh = fopen($file, 'a');
        $data = htmlspecialchars("\n" . $name . " : " . $message . "  (**" . date('m-d-y h:i:s a') . "**)");
        fwrite($fh, $data);
        fclose($fh);
        return $data;
    }

    function readFromFile(){
        $file = "log.txt";
        $fh = fopen($file, 'r');
        $data = fread($fh, filesize($file));
        fclose($fh);
        return $data;
    }
?>