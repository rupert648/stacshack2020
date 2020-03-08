"use strict";


let hostname = window.location.hostname;
let port = window.location.port;
const url = 'ws://' + hostname + ':' + port;
const connection = new WebSocket(url);
let root = "";

function requestSignUpPage(){
  httpGetHTML("/profilePageChild.html");
  httpGetScript("/Client.js");
  // window.open("/profilePageChild.html")

  // var xmlHttp = new XMLHttpRequest();
  //   xmlHttp.open( "GET", "/profilePageChild.html", false ); // false for synchronous request
  //   xmlHttp.send( null );
}



function signUp(){
  let child_signup_info = {}
  child_signup_info["request"] = "child_signup";
  child_signup_info["signup_info"] = {
    email : document.getElementById("email").value,
    name : document.getElementById("name").value,
    password : document.getElementById("password").value,
    photo : document.getElementById("photo").value,
    department : document.getElementById("department").value,
    alcohol : document.getElementById("alcohol").value,
    interests : document.getElementById("interests").value,
    number_children : document.getElementById("number_children").value,
    night : document.getElementById("night").value
  }

  console.log("signed up");
  console.log(child_signup_info);

  connection.send(JSON.stringify(child_signup_info));

}





function swipeRight(){
  //accept parent
  //called on event: swipe right
  if (count < parent_list.length) {
    let parent_email = parent_list[count].email;
    let parent = parent_list[count++];
    let req = {}
    let user_email = sessionStorage.getItem("user_email");

    //= FROM HTML
    req["request"] = "accept_parent";
    req["user_email"] = user_email;
    req["parent_email"] = parent_email;

    displayParentProfile(parent);
    console.log("swiped right");
    console.log(req);

    connection.send(JSON.stringify(req));
  } else {
    console.log("Reached end of list");
  }

}

function swipeLeft(){
  //reject parent
  //called on event: swipe left

  //nothing sent to server??
  if (count < parent_list.length) {
    console.log("swiped left");
    let parent = parent_list[count++];
    displayParentProfile(parent);
  } else {
    console.log("Reached end of list");
  }

}


function displayParentProfile(parent){
  console.log(parent);
    document.getElementById("card_image").src = parent["photo"]; //change image link
    document.getElementById("Criteria 1").innerHTML = "Alcohol: " + parent["alcohol"];
    document.getElementById("Criteria 2").innerHTML = "Department: " + parent["department"];
    document.getElementById("Criteria 3").innerHTML = "Interests: " + parent["interests"];
    document.getElementById("Criteria 4").innerHTML = "Number of children: " + parent["numb_child"];
    document.getElementById("Criteria 5").innerHTML = "family name: " + parent["family_name"];

}



function storeUserLocal(user_info){
    // Store
    console.log(user_info.login_info.email);
    sessionStorage.setItem("user_email", user_info.login_info.email);
}

var parent_list = [];
var count = 0;

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

function httpGetHTML(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  // window.open(theUrl);
  document.location = theUrl;
  return xmlHttp.responseText;
}

function httpGetScript(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  // window.open(theUrl);

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
  console.log(obj);
  switch(obj["response"]) {
    case "html_parents_list":
        document.getElementsByTagName("html")[0].innerHTML = obj["parents_list"];
        // httpGetScript("\cardswipes.js")
        break;
    // case "html_sign_up":
    //     document.getElementsByTagName("html")[0].innerHTML = obj["parents_list"];
    //     break;
    case "child_login":
        // httpGet("/index2.html")
        parent_list = obj["parents_list"];
        // for(const parent of parent_list){
        //   parent_list.next();
        //sessionStorage.setItem("parent_email", parent["email"]);
          // var markup =
        count = 0;
        console.log(document.getElementsByTagName("button"));

        if (count < parent_list.length) {
          displayParentProfile(parent_list[count++]);
        }
        document.getElementsByTagName("button")[0].setAttribute("onclick", "swipeLeft()");

        document.getElementsByTagName("button")[1].setAttribute("onclick", "swipeRight()");
        break;
        case "bad_login":
          //error
          alert("Bad login attempt, try changing email or user name");
          break;
        case "bad_signup":
          //error
          alert("Bad signup attempt, please check your details are correct and you are using a University of St Andrews email address");
          break;
  }
      // document.getElementsById("card").innerHTML = markup
    // }
    //
    // displayParentProfile(parent_list);
    // document.getElementsById("card").innerHTML = markup //CHANGE TAGNAME

    //send another user list request to server?
    //would need to track users already viewed?
    //set page to display "no more parent profiles to view please come back later"

  //error??
};
