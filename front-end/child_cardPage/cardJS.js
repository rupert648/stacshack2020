"use strict";


let hostname = window.location.hostname;
let port = window.location.port;
const url = 'ws://' + hostname + ':' + port;
const connection = new WebSocket(url);
let root = "";

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

function httpGetHTML(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  // window.open(theUrl);
  document.location = theUrl;
  return xmlHttp.responseText;
}
