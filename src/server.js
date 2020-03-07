"use strict";

let dlj = require("./dir_list_json.js");  //class given to us
let os = require('os'); //operating system module
let ws = require('ws')  //websocket module
let HTTP = require('http')  //http module
let fs = require('fs')  //filesystem module
let firebase = require('firebase')  //firebase module

let css = "/dir_list.css" //path for css file

const port = 21436;

//////////////////// DATABASE INIT ////////////////////
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://stacshack2020.firebaseio.com"
});

//use this to generate the html for the html file we first send out.
function generateHTML(markup) {
  //this contains the default html to send to the server.
  let header = `
  <!DOCTYPE html>
  <html>

  <head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="style.css" type="text/css" />
  <title>Example Web Page for CS2003 Web2</title>
  </head>

  <body>

  <h1>STACSHACK</h1>
  <hr />
  `;
  let footer = `
  <script src="client.js"></script>
  </body>
  </html>
  `;

  return header+markup+footer;
}


///////////////////////////////Starting the server ////////////////////////

//function to take HTTP requests from the client
function serveApp(request, response) {
  switch (request.url) {  //check to see what the request is
    case "/": //HTML
      //send the HTML
      response.writeHead(200, {"Content-Type": "text/html"});
      // we generate some default markup to send just in case first request fails.
      response.end(generateHTML(markup));
      break;


    case "/client.js":  //JS
    //try and read our client side javascript file.
    fs.readFile(__dirname + "/client.js", function (error, data) {
      if (error) {
        response.writeHead(500)
        response.end("Error loading script")
      } else {
        //send javascript to the client
        response.writeHead(200, {"Content-Type": "text/script"});
        response.end(data)
      }
    });
    break;
    case "/style.css": //CSS
      //try and read our CSS file
      fs.readFile(__dirname + "/dir_list.css", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading css")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/css"});
          response.end(data)
        }
      });
      break;
  }
}

//start the HTTP server
const httpserver = HTTP.createServer(serveApp).listen(port, os.hostname);

//websocket server
const wss = new ws.Server({ server: httpserver });

//when we get a connection
wss.on('connection', (ws) => {
    //event handler for when we get a message
    ws.on('message', (message) => {
        //message is a JSON string
        //parse it to a Javascript object


    });

});

//log out the server host and port number so we can easily connect.
console.log(os.hostname+":"+port);
