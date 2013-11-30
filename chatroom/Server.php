<?php
//THIS FILE HANDLES IO

//EST
date_default_timezone_set('America/New_York');

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': 
    echo "Users: ";
    foreach(apc_fetch('userList') as $name){
        echo $name . ", ";
    }
    echo "<br><br>";
    echo "Messages: <br><br>";
    $lines = explode("\n", readFromFile());
    foreach ($lines as $line){
        echo '&nbsp' . $line . "<br>";
    }
    break;
    case 'POST':
    if (hasHeader("MessagePost")){
        $data = writeToFile($_POST['name'], $_POST['message']);
        //Used to tell client that the message has been sent
        //Date is used to maintain consistency between Server and Client
        echo ("Received at: " . date('m-d-y h:i:s a')); 
    } else if (hasHeader("LoginPost")){
        //Login
        userJoined($_POST['name']);
    } else if (hasHeader("LogoutPost")){
        //Logout
        userLeft($_POST['name']);
    } else {
        echo "Error!";
    }
    break;
}

function userJoined($name){
    if (apc_fetch('userList') !== false && apc_fetch('userList') !==null){
        $newArray = apc_fetch("userList");
        //array_push() returns the length of the array!
        array_push($newArray, $name);
        apc_store('userList', $newArray);
    } else {
        echo "First user!\n";
        $array = array($name);
        apc_store('userList', $array);
    }
    echo "Name set!\n";
    echo print_r(apc_fetch('userList'));
    writeToFile("Server", $name . " has entered the chatroom!");
}

function userLeft($name){
    $index = 0;
    foreach(apc_fetch('userList') as $username){
        if ($username === $name){
            break;
        }
        $index++;
    }
    array_splice($array, $index, 1);
    apc_store('userList', $array);
    writeToFile("Server", $name . " has left the chatroom!");
    //Clear log when all users have left
    if (count($array) == 0){
        file_put_contents("log.txt", "");
    }
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

function hasHeader($header){
    foreach ($_SERVER as $h){
        if ($header === $h){
            echo "It's a " + $h . "\n";
            return true;
        }
    }
    return false;
}
?>