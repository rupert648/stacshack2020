
let wsUrl = "ws://" + location.hostname + ":" + location.port;
let ws = new WebSocket(wsUrl);  //create the websocket
let defaultPath = ".";  //default absolute path
let currentPath;  //current absolute path
let displayPath;  //relative path

const fileInfo_keys = [
    "filename", "type", "size",
    "atime", "mtime", "ctime", "birthtime"
  ];

//function for when the web socket is opened
ws.onopen = function() {
  //send out a message requesting information about the path sent to us
  let message = `{
                    "request":"child_login",
                    "login_info":
                      {
                        "email":"user@st-andrews.ac.uk",
                        "password":"test"
                      }
                 }
                 `

  ws.send(message);
  console.log("message sent!...  "+message);

  //set the "root path" to the current path
}

//listener for a websocket error
ws.onerrer = function(e) {
  alert("WebSocket Error: " + e);
}

//listener for the web socket closing
ws.onclose = function(e) {
  alert("WebSocket closed.");
}
