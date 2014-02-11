<?php
//SWAG
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
echo "Yo<br>";
echo "$root<br>";
echo "<br>";

switch($_SERVER['REQUEST_METHOD']){
  case 'GET':

    getFile("$root/messageBoard.php");
    printDirectory("$root/");
    break;
}

function getFile($location){
   header("Content-disposition: attachment; filename=$location");
   header("Content-type: application/php");
   readfile("$location.pdf");
}

function printDirectory($directory){
    print_r(scandir($directory));
}

?>