<?php

if (checkIfBanned($_SERVER['REMOTE_ADDR'])){
    header("Location: http://michaelman.net/banned.html");
}

function checkIfBanned($IP){
    return true;
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