var inputForm;
var urlField;


function startProxy(event){
    inputForm= document.getElementById("URLForm");
    urlField = document.getElementById("urlField");
    var proxyWindow = window.open("proxy.php?URL=http://" + urlField.value, "Michael Man's Proxy Service", "height=700,width=1000");
    
    return false;
}