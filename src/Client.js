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



function displayParentProfile(parent){

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
    let parent_list = obj["parents_list"];

    for(const parent of parent_list){
      var markup = displayParentProfile(parent);
      document.getElementsByTagName("parentcard")[0].innerHTML = markup //CHANGE TAGNAME
    }
    //send another user list request to server? 
    //would need to track users already viewed?
    //set page to display "no more parent profiles to view please come back later"
  }
  //error??
};
