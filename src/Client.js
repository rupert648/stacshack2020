"use strict";

let hostname = window.location.hostname;
let port = window.location.port;
const url = 'ws://' + hostname + ':' + port;
const connection = new WebSocket(url);
let root = "";
let count = 0;

/**
 * The search function is called in the event-handler when the search button is clicked. 
 * Takes in a search term and formats a JSON string to send to server to request the search results.
 */
function search() {
  let input = document.getElementById("searchBar").value;

  if (input.length == 0) {
    alert("No search term entered, please try again.");
  } else {
    let searchReq = {}
    searchReq["request"] = "search";
    searchReq["searchTerm"] = input;
    connection.send(JSON.stringify(searchReq));
  }
}


/**
 * Sorting function to allow the files to be sorted on the page by any column in the table in ascending or descending order. 
 * Click once on a column name for ascending and twice for descending 
 * Bubble sort code modified from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_desc
 * @param {*} column numeric value passed in in html referring to the number of the column as it appears on the page
 */
function sortTable(column) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementsByTagName("files")[0];
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = getRows(table);
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 0; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i][column];
      y = rows[i + 1][column];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      let row1 = rows[i][column].parentNode;
      let row2 = rows[i + 1][column].parentNode;
      row1.parentNode.insertBefore(row2, row1);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
/**
 * Returns a 2D array of rows representing the files table.
 * Each row is an array of elements taken from the DOM. 
 * @param {*} table the files table to be accessed
 */
function getRows(table) {
  let rows = [];
  let files = table.getElementsByTagName("fileinfo");

  for (let i = 1; i < files.length; i++) {
    let row = [];
    row.push(document.getElementsByTagName("filename")[i]);
    row.push(document.getElementsByTagName("type")[i]);
    row.push(document.getElementsByTagName("size")[i]);
    row.push(document.getElementsByTagName("atime")[i]);
    row.push(document.getElementsByTagName("mtime")[i]);
    row.push(document.getElementsByTagName("ctime")[i]);
    row.push(document.getElementsByTagName("birthtime")[i]);

    rows.push(row);
  }
  return rows;
}

/**
 * Function to allow the user to traverse back up to a parent directory in the filesystem.
 * Called when the "Go Up" button is clicked.
 * Gets the current directory path from DOM and splits by "/" to find the length of the path.
 * If the path length is one or the current directory matches the root started from then the user will not be allowed to traverse up a directory.
 * Otherwise, the last part of the path is removed. Then path is concatenated with "/"s again and JSON request is sent to server to retrieve parent directory.
 */
function goUp() {
  let req = {}
  let path = "";
  let currentDir = document.getElementsByTagName("directoryname")[0].innerHTML;
  let lastPath = currentDir.split("/");

  if (lastPath.length == 1) {
    alert("No parent, you have reached the root.")
  }
  else if (currentDir === root) {
    alert("No permissions above start directory.")
  }
  else if (lastPath.length > 1) {
    for (let i = 0; i < lastPath.length - 1; i++) {
      path += lastPath[i];
      if (i < lastPath.length - 2) {
        path += "/";
      }
    }
    req["request"] = "dirinfo";
    req["dirpath"] = path;
    connection.send(JSON.stringify(req));
  }

}

/**
 * Function to move to a subdirectory, called when a user clicks on a directory name. 
 * Concatenates the current directory path with the sub-directory name after it.
 * Sends new path to server as request.
 * @param {*} value directory name
 */
function changeDirectory(value) {
  let req = {}
  let path;
  let currentDir = document.getElementsByTagName("directoryname")[0].innerHTML; //gets current directory path from DOM
  path = currentDir + "/" + value; //adds sub-directory name to current path to get required path

  req["request"] = "dirinfo";
  req["dirpath"] = path;

  connection.send(JSON.stringify(req));
}
/**
 * Function to show/hide info in the table when the corresponding checkbox is clicked.
 * @param {*} column name 
 */
function checkBoxesDisplayInfo(column) {
  let display;
  if (document.getElementById(column).checked == false) {
    display = "none";
  } else {
    display = "table-cell";
  }
  let typeFields = document.getElementsByTagName(column) //changes display value for every element in column
  for (let x = 0; x < typeFields.length; x++) {
    typeFields[x].style.display = display; //change css display value
  }
}
/**
 * Display checkboxes under the table on page. 
 * Calls event handler to show/hide table information when box is checked/unchecked.
 */
function makeCheckBoxes() {
  let markup = "";
  markup += "<input type=checkbox id=type checked=true onclick=\"checkBoxesDisplayInfo('type');\" value=type> type </input>"
  markup += "<input type=checkbox id=size checked=true onclick=\"checkBoxesDisplayInfo('size');\" value=size> size </input>"
  markup += "<input type=checkbox id=atime checked=true onclick=\"checkBoxesDisplayInfo('atime');\" value=atime> atime </input>"
  markup += "<input type=checkbox id=mtime checked=true onclick=\"checkBoxesDisplayInfo('mtime');\" value=mtime> mtime </input>"
  markup += "<input type=checkbox id=ctime checked=true onclick=\"checkBoxesDisplayInfo('ctime');\" value=ctime> ctime </input>"
  markup += "<input type=checkbox id=birthtime checked=true onclick=\"checkBoxesDisplayInfo('birthtime');\" value=birthtime> birthtime </input>"
  return markup;
}

/**
 * Generates the first row of the table as the headings.
 * Calls event handlers to sort table information by column when one of the column names is clicked.
 * Gives numeric values to each column for accessing table array in sortTable function.
 */
function generateTableHeader() {
  let markup = "";
  markup += "<fileinfo type=\"header\">"
  markup += "   <filename><span onclick=\"sortTable(0);\">filename</span></filename>"
  markup += "   <type><span onclick=\"sortTable(1);\">type</span></type>"
  markup += "   <size><span onclick=\"sortTable(2);\">size</span></Size>"
  markup += "   <atime><span onclick=\"sortTable(3);\">atime</span></atime>"
  markup += "   <mtime><span onclick=\"sortTable(4);\">mtime</span></mtime>"
  markup += "   <ctime><span onclick=\"sortTable(5);\">ctime</span></ctime>"
  markup += "   <birthtime><span onclick=\"sortTable(6);\">birthtime</span></birthtime>"
  markup += "</fileinfo>"

  return markup;
}

const fileInfo_keys = [
  "filename", "type", "size",
  "atime", "mtime", "ctime", "birthtime"
];

/**
 * Function from the dir_list_json starter code.
 * Converts file info from server into HTML.
 * @param {*} fileInfo received from server.
 */
function fileInfo2Markup(fileInfo) {
  if (!fileInfo) { return null; }

  let markup = "";

  markup += "\n    <fileinfo type=\"" + fileInfo["type"] + "\">\n";
  for (let i = 0; i < fileInfo_keys.length; ++i) {
    let k = fileInfo_keys[i];
    let v = fileInfo[k];
    let a = ""; // attributes for markup tag
    if (k.includes("time")) {
      // Keep the millisecond time as an attribute, but
      // use a user-friendly string to display in markup.
      // The millisecond time could be useful for ordering files.
      let t = new Date();
      t.setTime(v);
      a += " " + k + "=\"" + v + "\"";
      v = t.toLocaleString("en-GB");
    }
    if (k == "filename" && fileInfo["type"] == "directory") {
      //added span tag and event handler to move to a subdirectory if a user clicks on it's name
      markup += "      <" + k + a + ">" + "<span onclick=\"changeDirectory('" + v + "');\">" + v + "<\/span>" + "</" + k + ">\n";
    }
    else {
      markup += "      <" + k + a + ">" + v + "</" + k + ">\n";

    }
  }
  markup += "    </fileinfo>\n";

  return markup;
}

/**
 * Function from the dir_list_json starter code.
 * Converts directory info from server into HTML.
 * @param {*} dirInfo received from Server
 */
function dirInfo2Markup(dirInfo) {
  if (!dirInfo) { return null; }

  let markup = "";

  // leading spaces and "\n" for convenience only - not neededs
  markup += "\n  <dirinfo>\n\n";
  markup += "      <server>" + dirInfo["server"] + "</server>\n\n";
  markup += "      <directoryname>" + dirInfo["directoryname"] + "</directoryname>\n\n";
  markup += "<button id=upButton onclick=\"goUp();\">Go up</button>"; //go up button added
  markup += "<br></br>"
  markup += "<input id=searchBar type=search placeholder=\"Search files...\"> \n";
  markup += "<button id=searchButton onClick=\"search();\">Search</button> \n";
  markup += "<br></br>"

  let files = dirInfo["files"];
  let filenames = Object.keys(files);

  markup += "    <files>\n";
  markup += generateTableHeader();

  for (let f = 0; f < filenames.length; ++f) {
    let fileInfo = files[filenames[f]];
    markup += fileInfo2Markup(fileInfo);
  }
  markup += "\n    </files>\n";
  markup += "<br></br>"
  markup += makeCheckBoxes(); //check boxes added
  markup += "<hr />"
  markup += "<searchResults style=display:none>Search</searchResults>"; //Section to display search results after a search is made.
  markup += "\n  </dirinfo>\n";

  return markup;
}

/**
 * Callback for a message received from server.
 * Parses JSON string from server to a JS object.
 * Converts the file and directory information to HTML and changes the DOM to display new HTML
 */
connection.onmessage = function (e) {
  let message = e.data;
  let obj = JSON.parse(message);
  if (obj["response"] == "dirinfo") {
    let info = obj["info"];

    let markup = dirInfo2Markup(info);

    let dirinfo = document.getElementsByTagName("dirinfo");
    dirinfo[0].innerHTML = markup;

    //if the message is the first one sent then client stores the starting directory
    if (count == 0) {
      root = document.getElementsByTagName("directoryname")[0].innerHTML;
    }
    count++;
  } else if (obj["response"] == "search") { //gets search results and displays them on page
    let results = obj["info"];
    var markup = "<h2>Search Results</h2>";
    if (results === "No results") {
      markup += "No search results, please try again."
    } else {
      var x
      for (x in results) {
        console.log(results.length)
        markup += "<p>" + x + "</p>";
      }
    }
    document.getElementsByTagName("searchResults")[0].innerHTML = markup;
    document.getElementsByTagName("searchResults")[0].style.display = "table";
  }
};
