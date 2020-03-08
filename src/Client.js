"use strict";

let hostname = window.location.hostname;
let port = window.location.port;
const url = 'ws://' + hostname + ':' + port;
const connection = new WebSocket(url);
let root = "";
let count = 0;



/**
 * Function from the dir_list_json starter code.
 * Converts file info from server into HTML.
 * @param {*} fileInfo received from server.
 */
// function fileInfo2Markup(fileInfo) {
//   if (!fileInfo) { return null; }

//   let markup = "";

//   markup += "\n    <fileinfo type=\"" + fileInfo["type"] + "\">\n";
//   for (let i = 0; i < fileInfo_keys.length; ++i) {
//     let k = fileInfo_keys[i];
//     let v = fileInfo[k];
//     let a = ""; // attributes for markup tag
//     if (k.includes("time")) {
//       // Keep the millisecond time as an attribute, but
//       // use a user-friendly string to display in markup.
//       // The millisecond time could be useful for ordering files.
//       let t = new Date();
//       t.setTime(v);
//       a += " " + k + "=\"" + v + "\"";
//       v = t.toLocaleString("en-GB");
//     }
//     if (k == "filename" && fileInfo["type"] == "directory") {
//       //added span tag and event handler to move to a subdirectory if a user clicks on it's name
//       markup += "      <" + k + a + ">" + "<span onclick=\"changeDirectory('" + v + "');\">" + v + "<\/span>" + "</" + k + ">\n";
//     }
//     else {
//       markup += "      <" + k + a + ">" + v + "</" + k + ">\n";

//     }
//   }
//   markup += "    </fileinfo>\n";

//   return markup;
// }

// /**
//  * Function from the dir_list_json starter code.
//  * Converts directory info from server into HTML.
//  * @param {*} dirInfo received from Server
//  */
// function dirInfo2Markup(dirInfo) {
//   if (!dirInfo) { return null; }

//   let markup = "";

//   // leading spaces and "\n" for convenience only - not neededs
//   markup += "\n  <dirinfo>\n\n";
//   markup += "      <server>" + dirInfo["server"] + "</server>\n\n";
//   markup += "      <directoryname>" + dirInfo["directoryname"] + "</directoryname>\n\n";
//   markup += "<button id=upButton onclick=\"goUp();\">Go up</button>"; //go up button added
//   markup += "<br></br>"
//   markup += "<input id=searchBar type=search placeholder=\"Search files...\"> \n";
//   markup += "<button id=searchButton onClick=\"search();\">Search</button> \n";
//   markup += "<br></br>"

//   let files = dirInfo["files"];
//   let filenames = Object.keys(files);

//   markup += "    <files>\n";
//   markup += generateTableHeader();

//   for (let f = 0; f < filenames.length; ++f) {
//     let fileInfo = files[filenames[f]];
//     markup += fileInfo2Markup(fileInfo);
//   }
//   markup += "\n    </files>\n";
//   markup += "<br></br>"
//   markup += makeCheckBoxes(); //check boxes added
//   markup += "<hr />"
//   markup += "<searchResults style=display:none>Search</searchResults>"; //Section to display search results after a search is made.
//   markup += "\n  </dirinfo>\n";

//   return markup;
// }



function swipeRight(){
  //accept parent
  //called on event: swipe right
  let req = {}
  let user_email = sessionStorage.getItem("email");

  let parent_email
  //= FROM HTML
  req["user_email"] = user_email;
  req["parent_email"] = parent_email;

  connection.send(JSON.stringify(req));
}

function swipeLeft(){
  //reject parent
  //called on event: swipe left

  //nothing sent to server??
}






function displayParentProfile(parent){
    document.getElementById("card_image").src = parent["photo"]; //change image link
    document.getElementById("Criteria 1").innerHTML = "Alcohol: " + parent["alcohol"];
    document.getElementById("Criteria 2").innerHTML = "Department: " + parent["department"];
    document.getElementById("Criteria 3").innerHTML = "Interests: " + parent["interests"];
    document.getElementById("Criteria 4").innerHTML = "Number of children: " + parent["number_children"];
    document.getElementById("Criteria 5").innerHTML = "Family name: " + parent["night"];

}



function storeUserLocal(user_info){
    // Store
    sessionStorage.setItem("user_email", user_info["email"]);
}


function userLogin(){
  //called on click of login button
  //get email from HTML
  let email = document.getElementById("emailInput").value;
  //get password from HTML
  let password = document.getElementById("passwordInput").value;
  //create user login object
  let user_login_info = {}
  user_login_info["request"] = "child_login";
  user_login_info["login_info"] ={
    email: email,
    password: password
  };

  //create JSON string user info
  storeUserLocal(user_login_info);
  //send JSON string
  connection.send(JSON.stringify(user_login_info));
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/**
 * Callback for a message received from server.
 * Parses JSON string from server to a JS object.
 * Converts the file and directory information to HTML and changes the DOM to display new HTML
 */
connection.onmessage = function (e) {
  let message = e.data;

  let obj = JSON.parse(message);
  if (obj["response"] == "child_login") {
    document.open();
    document.write(httpGet("/index2.html"));
    document.close();
    let parent_list = obj["parents_list"];

    for(const parent of parent_list){
      // var markup =
      displayParentProfile(parent);
      // document.getElementsById("card").innerHTML = markup
    }
    //
    // displayParentProfile(parent_list);
    // document.getElementsById("card").innerHTML = markup //CHANGE TAGNAME

    //send another user list request to server?
    //would need to track users already viewed?
    //set page to display "no more parent profiles to view please come back later"
  }
  //error??
};
