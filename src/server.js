"use strict";

let dlj = require("./dir_list_json.js");  //class given to us
let os = require('os'); //operating system module
let ws = require('ws')  //websocket module
let HTTP = require('http')  //http module
let fs = require('fs')  //filesystem module
let path = require('path')  //path module

let css = "/dir_list.css" //path for css file

const port = 21436;

//take the argument from the command line for the default pathway
if (process.argv.length <= 2) {
  console.log("Usage: node dir_list_json_test.js <dir_path>");
  process.exit(-1);
}

//////////////////////// Getting JSON from filesystem ////////////////

let dirPath = process.argv[2];

let markup;
//async function to get information for default pathway
dlj.getDirInfo(dirPath, (error,result) => {
  //exit if this fails
  if (error) { console.log(error); process.exit(0); }

  else {
    //use the resulting json object to generate markup to send as default html.
    markup = dlj.dirInfo2Markup(result) //markup text to be used for index.html
  }
})

///////////////// Generating HTML File /////////////////

//use this to generate the html for the html file we first send out.
function generateHTML(markup) {
  //this contains the default html to send to the server.
  let header = `
  <!DOCTYPE html>
  <html>

  <head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="dir_list.css" type="text/css" />
  <title>Example Web Page for CS2003 Web2</title>
  </head>

  <body>

  <h1>CS2003 Web 2</h1>
  <button type=\"button\" id=\"backButton\" onClick=\"goBack()\">Up</button>
  <hr />
  <dirspace>
  `;
  let footer = `
  </dirspace>
  <hr />
    <div class = "checkboxes">
      <input type="checkbox" name="type" value="typecheck" onclick=\"checkBoxChange(this)\" checked>Type
      <input type="checkbox" name="size" value="sizecheck" onclick=\"checkBoxChange(this)\" checked>size
      <input type="checkbox" name="atime" value="atimecheck" onclick=\"checkBoxChange(this)\" checked>atime
      <input type="checkbox" name="mtime" value="mtimecheck" onclick=\"checkBoxChange(this)\" checked>mtime
      <input type="checkbox" name="ctime" value="ctimecheck" onclick=\"checkBoxChange(this)\" checked>ctime
      <input type="checkbox" name="birthtime" value="birthtimecheck" onclick=\"checkBoxChange(this)\" checked>birthtime
    </div>
  <hr />
  Search for Files: <input type=\"text\" name=\"search\" id="search_input" autocomplete=\"off\">
  <input type="submit" value ="Submit" onclick=\"submitSearch()\">
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
    case "/dir_list.css": //CSS
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
        let m = JSON.parse(message)

        //due to protocol we have a request type
        if (m.request === "dirinfo"){ //a request for directory information

          //first check that the directory being requested is a "child" of the root directory.
          //this prevents the client from navigating our whole file system.
          if (isChildOf(m.dirpath, dirPath)){

            //if valid, try and get the directory information
            dlj.getDirInfo(m.dirpath, (error,result) => {
              if (error) { console.log(error); }

              else {
                //add these extra values to adhere to protocol.
                let d_tx = {response:"dirinfo", info:result}

                //turn it into a string
                d_tx = JSON.stringify(d_tx);

                //send it to the client
                ws.send(d_tx);
              }
            });
          }

        } else if (m.request === "search") {  //a search request
            let message = searchFiles(m.searchTerm);

            //turn the json object into a string
            let d_tx = JSON.stringify(message);

            //send the response to the client.
            ws.send(d_tx);
        }
    });

});


let searchResultFiles = [];  //global variable which we can give search result to

//the function for calling the recursive case
let searchFiles = (searchTerm) => {

  //reset the search results array
  searchResultFiles = [];

  //our starting directory - don't want to search any further back
  let startdir = dirPath;
  //call recursive function
  recursivelySearch(startdir, searchTerm);  //starting directory, the search term we are looking for

  //message to fit protocol
  let message = {response:"search", info:searchResultFiles}

  return message;
}

//the recursive function
let recursivelySearch = (startdir, searchTerm) => {
  //turn search term into regex
  let regex = RegExp(searchTerm);

  //call the get dir info given to us, returns a list of all the files in that directory
  //including other directories.
  dlj.getDirInfo(startdir, (error, result) => {
    if (error) { console.log(error); }

    else {
      //the list of files
      let files = result.files;

      for (var key in files){ //getting individual file

        //test if the filename contains our search term.
        if(regex.test(files[key].filename)) {
          searchResultFiles.push(files[key])  //push it onto the search result
        }

        //if the file is a directory, search into there as well
        if (files[key].type === "directory") {
          recursivelySearch(startdir + "/"+files[key].filename, searchTerm);
        }
      }
    }
  });
}

//function to check that the directory called is a sub-directory
let isChildOf = (child, parent) => {
  //get the relative path.
  let relative = path.relative(parent, child);
  let isSubDir = false;

  //check it doesn't start with ".."
  //this would indicate that we have had to navigate backwards
  //also check its not absolute so they can't enter a full new path
  isSubDir = (!relative.startsWith("..") || relative === "") && !path.isAbsolute(relative);

  if (!isSubDir) {
    console.log(child + " --> this directory is not allowed.")
  }
  return isSubDir;
}

//log out the server host and port number so we can easily connect.
console.log(os.hostname+":"+port);
