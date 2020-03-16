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

var parent_html = `
<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <div class="header">
  <h1><center>Raisin-A-Family</center></h1>
  </div>
  <title>Raisin-A-Family! Your Matches!</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href = "parent_results.css" type="text/css"/>
  </head>

<style>
* {
  box-sizing: border-box;
}

/* Create two unequal columns that floats next to each other */
.column {
  float: left;
  padding: 10px;
}

.left {
  width: 65%;
}

.right {
  width: 35%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

</style>

<body class="my-login-page">
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-md-center h-100">
				<div class="card-wrapper">
					<div class="card fat">
						<div class="card-body">

              <div class="row text">
              <div class="column left text-white" style="background-color:#992E2E;">
                <h2>Academic Children Who Swiped Right On You: </h2><br><br>
                <li id="ch_1">Child 1</li><br>
                <li id="ch_2">Child 2</li><br>
                <li id="ch_3">Child 3</li><br>
                <li id="ch_4">Child 4</li><br>
                <li id="ch_5">Child 5</li><br>
              </div>

              <div class="column right text-white" style="background-color:#992E2E;">
                <h2>% Match</h2><br><br>
                <li id="ch_1">Match %</li><br>
                <li id="ch_2">Match %</li><br>
                <li id="ch_3">Match %</li><br>
                <li id="ch_4">Match %</li><br>
                <li id="ch_5">Match %</li><br>
              </div>
            </div>

</div>
</div>
</div>
</div>
</div>
</section>

<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script src="js/my-login.js"></script>

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
      fs.readFile("../front-end/LogIn_Page2/index.html", function (error, data) {
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
      fs.readFile("../front-end/Profile_Page_Child/profilePageChild.html", function (error, data) {
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
      fs.readFile("../front-end/Profile_Page_Child/profilePageChild.css", function (error, data) {
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
      fs.readFile("../front-end/Profile_Page_Parent/profilePageParent.html", function (error, data) {
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
      fs.readFile("../front-end/Profile_Page_Parent/profilePageParent.css", function (error, data) {
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
      fs.readFile("../front-end/LogIn_Page2/Client.js", function (error, data) {
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
    case "/carswipes.js":  //JS
      //try and read our client side javascript file.
      fs.readFile("../front-end/child_cardPage/cardswipes.js", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading script")
        } else {
          //send javascript to the client
          response.writeHead(200, {"Content-Type": "text/script"});
          response.end(data)
        }
      });
    case "/style.css": //CSS
      //try and read our CSS file
      fs.readFile("../front-end/LogIn_Page2/style.css", function (error, data) {
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
      fs.readFile("../front-end/child_cardPage/index2.html", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading main page")
        } else {
          //send html to the client
          response.writeHead(200, {"Content-Type": "text/html"});
          response.end(data);
        }
      });
      break;
    case "/cardswipes.css":
      fs.readFile("../front-end/child_cardPage/cardswipes.css", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading css")
        } else {
          //send css to the client
          response.writeHead(200, {"Content-Type": "text/css"});
          response.end(data)
        }
      });
      break;
    case "/swipecard.css":
      fs.readFile("../front-end/child_cardPage/swipecard.css", function (error, data) {
        if (error) {
          response.writeHead(500)
          response.end("Error loading css")
        } else {
          //send css to the client
          response.writeHead(200, {"Content-Type": "text/css"});
          response.end(data)
        }
      });
      break;
    case "cardJS.js":
      console.log("sending cardJS.js");
      fs,readFile("../front-end/child_cardPage/cardJS.js", function(error, data) {
        if (error) {
          response.writeHead(500);
          response.end("Error loading css");
        } else {
          response.writeHead(200, {"Content-Type": "text/script"});
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

function convertToJson(responseType, parent_list, html) {
  let reply;
  if(html) {
    reply = {response: responseType, parents_list: parent_list, html:html};
  } else {
    reply = {response: responseType, parents_list: parent_list};
  }
  let JsonReply = JSON.stringify(reply); // convert to JSON
  return JsonReply;
}


//when we get a connection
wss.on('connection', (ws) => {
    //event handler for when we get a message
    ws.on('message', (message) => {
        //message is a JSON string
        //parse it to a Javascript object
        let request = JSON.parse(message);
        switch(request["request"]) {
          case "child_signup":

            signupChild(request, ws);
            break;

          case "child_login":
            let login_info = request["login_info"];
            let email2 = login_info["email"];
            let password2 = login_info["password"];

            login(ws, email2, password2);
            break;
          case "accept_parent":
            console.log(request);
            console.log("UPDATE children SET parent_email = \""+request.parent_email+"\" WHERE email = \""+request.user_email+"\";");

            let data = [request.parent_email, request.user_email];
            let updateSql = `UPDATE children
            SET parent_email = ?
            WHERE email = ?`;

            db.run(updateSql, data, function(err) {
              if (err) {
                return console.error(err.message);
              }

              console.log(`Row(s) updated: ${this.changes}`);

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

let signupChild = function(request, ws) {
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

          login(ws, email, password);


    });
}

let login = function(ws, email, password) {
  let sql = 'SELECT * FROM children WHERE children.email = ?';
  db.get(sql, [email], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      console.log(JSON.stringify(row));
      // correct password
      if (row.password === password) {
        let response = getMatches(row);
        response.then((result) => {
          console.log(result.length);
          // for (let i = 0 ; i  < result.length ; i++) {
          //   console.log(result[i]);
          // }
          fs.readFile("../front-end/child_cardPage/index2.html", function (error, data) {
            if (error) {
              console.log(error);
            } else {
              //send javascript to the client
              const content = data
              console.log(content.toString('utf8'));

              ws.send(convertToJson("child_login", result, content.toString('utf8')));
            }
          });
          //ws.send(convertToJson("child_login", result));
        }, (error) => {
          console.log(error);
        });
      }
    }
      // parent login
    else {
      console.log("logging in parent");
      let s = 'SELECT * FROM parents WHERE parents.email = ?';
      db.get(s, [email2], (er, r) => {
        if (er) {
          return console.error(er.message);
        }
        if (r) {
          console.log("parent login");
          ws.send(convertToJson("parent_login", parent_html));
          console.log(JSON.stringify(r));
          // correct password
          if (r.password === passwrd) {
              ws.send(convertToJson("parent_login", parent_html));
          }
          else {
            ws.send(convertToJson("bad_login", "incorrect password"));
          }
          // incorrect password
        }
        // no user in database
        else {
          ws.send(convertToJson("bad_login", "no user"));
        }
      });
    }
  });
}

//log out the server host and port number so we can easily connect.
console.log(os.hostname+":"+port);
