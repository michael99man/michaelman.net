<?php
//THIS FILE HANDLES IO

switch($_SERVER['REQUEST_METHOD'])
{
case 'GET': 
    echo "GTFO!"; 
    break;
case 'POST':
    writeToFile($_POST['name'], $_POST['score']);
    echo ("Saved: " . $_POST['name'] . " - " . $_POST['score']); 
    break;
}
    
    function writeToFile($name, $score){
        $file = "scores.txt";
        $fh = fopen($file, 'a');
        $data = "\n" . $name . " : " . $score;
        fwrite($fh, $data);
        fclose($fh);
    }
?>