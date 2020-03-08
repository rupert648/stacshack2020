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


var index2 = `
<!DOCTYPE html>
<html>



<head>
  <meta charset="utf-8">
  <title>Cardswipe Test</title>
  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" type="text/css" href="cardswipes.css">
  <link rel="stylesheet" type="text/css" href="swipecard.css">

</head>

<body>
  <header>
    <h1>Raisin A Family</h1>
  </header>
  <section>
    <div class="cardcontainer list" id="card">

      <!-- <ul class="cardlist"> -->
        <!-- <li class="card current"><img src="images/photo1.png" alt="card1"></li> -->
        <!-- <li class="card"><img src="images/photo2.jpg" alt="card2"></li>
        <li class="card"><img src="images/photo3.png" alt="card3"></li>
        <li class="card"><img src="images/photo4.jpeg" alt="card4"></li>
        <li class="card"><img src="images/photo5.png" alt="card5"></li>
        <li class="card"><img src="images/photo1.jpg" alt="card6"></li>
        <li class="card"><img src="images/photo1.png" alt="card7"></li>
        <li class="card"><img src="images/photo1.jpeg" alt="card8"></li>
        <li class="card"><img src="images/photo1.png" alt="card9"></li>
        <li class="card"><img src="images/photo1.png" alt="card10"></li> -->
      <!-- </ul> -->

      <ul class="card current" id="current_card">
        <li><img id="card_image" src="images/photo1.png" alt="card1"></li>
        <li id="Criteria 1">Criteria 1</li>
        <li id="Criteria 2">Criteria 2</li>
        <li id="Criteria 3">Criteria 3</li>
        <li id="Criteria 4">Criteria 4</li>
        <li id="Criteria 5">Criteria 5</li>


      </ul>



      <button id="but-nope">X</button>
      <button id="but-yay">✔</button>
      <span id="counter"></span>
    </div>
    <ul class="cardlist" id="results">
    </ul>
  </section>


  <!-- <script src="cardswipes.js"></script>
  <script src="swipecard.js"></script> -->
  <script src="Client.js"></script>

</body>

</html>
`;

///////////////////////////////Starting the server ////////////////////////

//function to take HTTP requests from the client
function serveApp(request, response) {
  switch (request.url) {  //check to see what the request is
    case "/": //HTML
      //send the HTML
      //response.writeHead(200, {"Content-Type": "text/html"});
      // we generate some default markup to send just in case first request fails.
      fs.readFile("../LogIn_Page2/index.html", function (error, data) {
        console.log("got to login");
        if (error) {
          response.writeHead(500)
          response.end("Error loading script")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/html"});

          response.end(data)
        }
      });
      break;

    case "/profilePageChild.html": //HTML
      //send the HTML
      //response.writeHead(200, {"Content-Type": "text/html"});
      // we generate some default markup to send just in case first request fails.
      fs.readFile("../Profile_Page_Child/profilePageChild.html", function (error, data) {
        console.log("got to child signup");
        if (error) {
          response.writeHead(500)
          response.end("Error loading script")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/html"});

          response.end(data)
        }
      });
      break;

    case "/profilePageChild.css": //CSS
      //try and read our CSS file
      fs.readFile("../Profile_Page_Child/profilePageChild.css", function (error, data) {
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

    case "/profilePageParent.html": //HTML
      //send the HTML
      //response.writeHead(200, {"Content-Type": "text/html"});
      // we generate some default markup to send just in case first request fails.
      fs.readFile("../Profile_Page_Parent/profilePageParent.html", function (error, data) {
        console.log("got to parent signup");
        if (error) {
          response.writeHead(500)
          response.end("Error loading script")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/html"});

          response.end(data)
        }
      });
      break;

    case "/profilePageParent.css": //CSS
      //try and read our CSS file
      fs.readFile("../Profile_Page_Parent/profilePageParent.css", function (error, data) {
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

    case "/Client.js":  //JS
    //try and read our client side javascript file.
    fs.readFile(__dirname + "/Client.js", function (error, data) {
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
      fs.readFile("../LogIn_Page2/style.css", function (error, data) {
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
    case "/index2.html":
      console.log("GET REQUEST: index2.html")
      fs.readFile("../front-end/index2.html", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading main page")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/html"});
          response.end(data);
        }
      });
      break;
    case "/cardswipes.css":
      fs.readFile("../front-end/cardswipes.css", function (error, data) {
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
    case "/swipecard.css":
      fs.readFile("../front-end/swipecard.css", function (error, data) {
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
            console.log("received child_signup")
            console.log(request)
              //put into db
            let signup_info = request["signup_info"];
            let email = signup_info["email"];
            let email_regex = new RegExp("^([a-zA-Z0-9_\\-\\.]+)@st-andrews.ac.uk");
            if (!email.match(email_regex)) {
              ws.send(convertToJson("error", "email"));
            }
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
                    let sql = 'SELECT * FROM children WHERE children.email = ?';
                    db.get(sql, [email], (err, row) => {
                      if (err) {
                        return console.error(err.message);
                      }
                      if (row) {
                        console.log(JSON.stringify(row));
                        // correct password
                        if (row.password === password) {
                          console.log("we're in");
                          let response = getMatches(row);
                          response.then((result) => {
                            console.log(result.length);
                            for (let i = 0 ; i  < result.length ; i++) {
                              console.log(result[i]);
                            }
                            ws.send(convertToJson("html_parents_list", index2));
                            ws.send(convertToJson("child_login", result));
                          }, (error) => {
                            console.log(error);
                          });
                        }
                        // incorrect password
                        else {
                          ws.send(convertToJson("bad_login", "incorrect password"));
                        }
                      }
                  });
                });

            break;

          case "child_login":
            let login_info = request["login_info"];
            let email2 = login_info["email"];
            let passwrd = login_info["password"];

            let sql = 'SELECT * FROM children WHERE children.email = ?'
            db.get(sql, [email2], (err, row) => {
              if (err) {
                return console.error(err.message);
              }
              if (row) {
                console.log(JSON.stringify(row));
                // correct password
                if (row.password === passwrd) {
                  console.log("we're in");
                  let response = getMatches(row);
                  response.then((result) => {
                    console.log(result.length);
                    for (let i = 0 ; i  < result.length ; i++) {
                      console.log(result[i]);
                    }
                    ws.send(convertToJson("html_parents_list", index2));
                    ws.send(convertToJson("child_login", result));
                  }, (error) => {
                    console.log(error);
                  });
                }
                // incorrect password
                else {
                  ws.send(convertToJson("bad_login", "incorrect password"));
                }
              }
              // no user in database
              else {
                ws.send(convertToJson("bad_login", "no user"));
              }
            });

            break;
          case "accept_parent":
            console.log(request);

            db.run(`INSERT INTO children(parent_email VALUES(?) WHERE children.email = `+request.user_email+";", [request.parent_email], function(err) {
                    if (err) {
                      return console.log(err.message);
                    }

                    console.log("A row has been inserted with the values:");

                  });
            break;

        }


    });

});


let getMatches = function(childRow) {

  let bestMatches = [];  //length 50, type row objects

  let sql = 'SELECT * FROM parents'
  let promise = new Promise((resolve, reject) => {
    db.all(sql, [], (err, parentRows) => {
    if (err) {
      throw err;
      reject(Error("sql query failed"));
    }
    parentRows.forEach((parentRow) => {
      let count = 0;

      count = (parentRow.department == childRow.department ? count+1: count);
      count = (parentRow.alcohol == childRow.alcohol ? count+1: count);
      count = (parentRow.interests == childRow.interests ? count+1: count);
      count = (parentRow.numb_child == childRow.numb_child ? count+1: count);
      count = (parentRow.night == childRow.night ? count+1: count);

      parentRow.metric = count;
      if (bestMatches.length < 50) {
        bestMatches.push(parentRow);
      } else {
        for (let i = 0; i < bestMatches.length; i++) {
          if (bestMatches.metric < count) {
            bestMatches[i] = parentRow;
            break;
          }
        }
      }
    });
    resolve(bestMatches);
  });
});
  return promise;
}
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
