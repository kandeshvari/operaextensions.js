function getProperties( object, depth, prefix ) {
    prefix = prefix||"";
    var t = "";
    for( key in object ) {
	t += prefix + "" + "[" + key  + "] " + typeofobject[key] + " " + object[key] + "\n";
	if( typeofobject[key] == "object" && depth>0 ) {
              t += getProperties( object[key], depth-1, "[" + key  + "]" + prefix );
	}
	if( depth==0 ){
	    t += "------------Max depth reached \n";
	}
    }
    return t;
}

var postToLocalHost = false;

function POST( result, msg ) {
    msg = msg||"";
    if( postToLocalHost && ( result == "PASSED" || result == "FAILED" ) ) {
      var lx = new XMLHttpRequest();
      lx.open("POST", "http://localhost/", true);
      lx.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      var dataResult = "result=" + (result=="PASSED" ? "PASS" : "FAIL");
      var dataMessage = result=="PASSED" ? "" : "%09" +  encodeURI(msg);
      lx.send( dataResult + dataMessage );
      opera.postError( "Submitted this result to SPARTAN:\t" + dataResult + "\n" + dataMessage);
    }

    var value = "Extensions: 000 - back broadCast userjs \t" + result + "\n" + msg;
    opera.postError( "==BackgroundProcess==\n" + value );

    if (opera.extension && opera.extension.tabs){
	opera.extension.tabs.create({
            url : "data:text/html, " + "==BackgroundProcess==<br />" + result + "<br />" + msg,
            focused : true
        });
    }
}
function PASS( msg ) { POST( "PASSED", msg ); }
function FAIL( msg ) { POST( "FAILED", msg ); }
function MANUAL( msg ) { POST( "MANUAL", msg ); }