"use strict";

let os = require('os'); //operating system module
let ws = require('ws')  //websocket module
let HTTP = require('http')  //http module
let fs = require('fs')  //filesystem module

let css = "/dir_list.css" //path for css file

const port = 21436;

//////////////////// DATABASE INIT ////////////////////
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../database/stacshack2020.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
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

  return header+footer;
}


///////////////////////////////Starting the server ////////////////////////

//function to take HTTP requests from the client
function serveApp(request, response) {
  switch (request.url) {  //check to see what the request is
    case "/": //HTML
      //send the HTML
      response.writeHead(200, {"Content-Type": "text/html"});
      // we generate some default markup to send just in case first request fails.
      response.end(generateHTML());
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

function convertToJson(responseType, parent_list) {
  let reply = {response: responseType, parents_list: parent_list};
  let JsonReply = JSON.stringify(reply); // convert to JSON
  return JsonReply;
}

//when we get a connection
wss.on('connection', (ws) => {
    //event handler for when we get a message
    ws.on('message', (message) => {
        //message is a JSON string
        //parse it to a Javascript object
        console.log(message);
        let request = JSON.parse(message);
        switch(request["request"]) {
          case "child_signup":
              //put into db
            let signup_info = request["signup_info"];
            let email = signup_info["email"];
            //var email_regex = new RegExp("^([a-zA-Z0-9_\-\.]+)@st-andrews.ac.uk");
            /*if (!email.match(email_regex)) {
              ws.send(convertToJson("error", "email"));
            }*/
            let userID = email.split("@")[0];
            let password = signup_info["password"];
            let name = signup_info["name"];
            let photo = signup_info["photo"];
            let department = signup_info["department"];
            let alcohol = signup_info["alcohol"];
            let interests = signup_info["interests"];
            let numb_child = signup_info["number_children"];
            let night = signup_info["night"];



            //table - email | password | name | photo | department | alcohol | interestes | numb_child | night

            db.run(`INSERT INTO children(password, email, userID, name, photo, department, alcohol, interests, numb_child, night) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [password, email, userID, name, photo, department, alcohol, interests, numb_child, night], function(err) {
                    if (err) {
                      return console.log(err.message);
                    }

                    console.log("A row has been inserted with the values:");
                    console.log(JSON.stringify(signup_info));
                    console.log("with rowid ${this.lastID}")
                  });

            break;

          case "child_login":
            let login_info = request["login_info"];
            //let email = login_info["email"];
            let passwrd = login_info["password"];



            break;

        }


    });

});
//
// wss.onclose = function(event){
//
//
// });

//log out the server host and port number so we can easily connect.
console.log(os.hostname+":"+port);
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });
