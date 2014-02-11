<?php
    if(isset($_GET["URL"])){
        $URL = urldecode($_GET["URL"]);
        $headers = get_headers($URL, 1);
        $contentType = $headers["Content-Type"];
        header('Content-Type:'. $contentType);
        $data = file_get_contents($URL);
        if (!strpos($contentType, 'text/html') | !strpos($contentType, 'text/css')){
            $data = fixLinks($data, $URL);
        }        
        echo $data;
    }

    //Fixes the absolute and relative links in the document
    //ONLY FOR HTML, CSS
    function fixLinks($data, $URL){
        $scriptLocation = "http://michaelman.net/proxy/proxy.php";
        $prefixes = array(
            "href=",
            "src=",
            //"content=",
            "action=",
            "href = ",
            "src = ",
            //"content = ",
            "action = ",
            "url("
        );
        $delims = array(
            '"',
            "'",
        );
        //TODO: Fix ../ problems
        foreach($delims as $delim){
            foreach($prefixes as $prefix){
                //First instance of $prefix . $delim
                $index = strpos($data, $prefix . $delim, 0);
                
                //While $data contains this combination of prefix and delim
                while ($index !== FALSE) {
                    //Makes script look AFTER this instance 
                    $index += strlen($prefix.$delim);
                    //Data before
                    $pre = substr($data,0,$index);
                    $end = strpos($data,$delim,$index);
                    $post = substr($data,$end);
                    $link = substr($data,$index,$end-$index);
                    
                    //Absolute Link
                    if (strpos($link,'://',0) !== FALSE)
                        $newurl = $scriptLocation . '?URL=' . urlencode($link);
                    //If first two characters are slashes (absolute link without http:)
                    else if (substr($link,0,2) == "//") {
                        $newurl=$scriptLocation . '?URL=' . urlencode("http:" . $link);
                    }
                    //If first character is a slash (relative link)
                    else if (substr($link,0,1) == "/") {
                        $siteroot = substr($URL,0, strpos($URL,'/', 8));
                        $newurl=$scriptLocation . '?URL=' . urlencode($siteroot . $link);
                    }
                    //TODO: Fix relative links OUT of current directory
                    //i.e. ../ opening
                    
                    
                    //If first character is not a slash (relative link)
                    else {
                        $sitepath = substr($URL,0,strrpos($URL,'/', 8));
                        $newurl=$scriptLocation . '?URL=' . urlencode($sitepath . '/'. $link);
                    }
                    $data = $pre . $newurl . $post;
                    $index += strlen($newurl) - strlen($link);
                    //Next instance of $prefix . $delim
                    $index = strpos($data,$prefix . $delim,$index);
                }
            }
        }
        return $data;
    }
?>

