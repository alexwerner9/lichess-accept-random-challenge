var CHALLENGES_CONTAINER_ID = 'challenge-app';
var CHALLENGE_MENU_TOGGLE_ID = 'challenge-toggle';

var timeControl = [];

var shiftPressed = false;
var acceptAll = true;

//Thanks stackoverflow user kennebec
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function acceptChallenge() {
  var challenges = document.getElementsByClassName("challenges");
  var challenge = challenges[Math.floor(Math.random() * challenges.length)]

  if(acceptAll) challenge.getElementsByClassName("accept")[0].click(); else {

    for(i = 0; i < timeControl.length; i++) {

        if(challenge.getElementsByClassName("desc")[0].innerText.includes(timeControl[i])) {

            challenge.getElementsByClassName("accept")[0].click();

        } else { acceptChallenge; }

    }

  }

}
function init(container) {
  
  var div = document.createElement("div");
  div.innerText = "Accept random challenge";
  div.id = "lichess-arc";
  div.onclick = acceptChallenge;

  initTable(container);

  container.prepend(div);
}

//Creates table
//TODO create more efficient way to create table elements
function initTable(container) {

  var dropDwn = document.createElement("div");

  //Main button

  var dropBtn = document.createElement("button");
  dropBtn.id = "dropBtnId";
  dropBtn.addEventListener('click', toggleList);
  dropBtn.innerText = "Time control";

  //Main table
  var listDiv = document.createElement("div");
  listDiv.id = "listDiv";

  var timeTable = document.createElement("table");
  timeTable.id = "parentTable";
  timeTable.setAttribute("class", "timeTable");

  //First row
  var firstRow = document.createElement("tr");
  firstRow.setAttribute("class", "timeTable");
  var onezero = document.createElement("td");
  onezero.innerText = "1 + 0";
  firstRow.appendChild(onezero);
  var twoone = document.createElement("td");
  twoone.innerText = "2 + 1";
  firstRow.appendChild(twoone);
  var threezero = document.createElement("td");
  threezero.innerText = "3 + 0";
  firstRow.appendChild(threezero);

  //Second row
  var secondRow = document.createElement("tr");
  secondRow.setAttribute("class", "timeTable");
  var threetwo = document.createElement("td");
  threetwo.innerText = "3 + 2";
  secondRow.appendChild(threetwo);
  var fivezero = document.createElement("td");
  fivezero.innerText = "5 + 0";
  secondRow.appendChild(fivezero);
  var fivethree = document.createElement("td");
  fivethree.innerText = "5 + 3";
  secondRow.appendChild(fivethree);

  //Third row
  var thirdRow = document.createElement("tr");
  thirdRow.setAttribute("class", "timeTable");
  var tenzero = document.createElement("td");
  tenzero.innerText = "10 + 0";
  thirdRow.appendChild(tenzero);
  var tenfive = document.createElement("td");
  tenfive.innerText = "10 + 5";
  thirdRow.appendChild(tenfive);
  var custom = document.createElement("td");
  custom.innerText = "All";
  custom.id = "allId";
  thirdRow.appendChild(custom);

  //Add rows to table
  timeTable.appendChild(firstRow);
  timeTable.appendChild(secondRow);
  timeTable.appendChild(thirdRow);

  //Add table to div and div to parent
  listDiv.appendChild(timeTable);
  dropDwn.appendChild(dropBtn);
  dropDwn.appendChild(listDiv);

  //Add whole table/button combo to page
  document.body.append(dropDwn);
  container.prepend(dropDwn);

  initTableData();
  addListener();
  loadPrevPressed();

}

//Load previously clicked elements if page is refreshed/come back to
function loadPrevPressed() {

    if(timeControl) {

        document.getElementById("parentTable").childNodes.forEach(function(element) {
            element.childNodes.forEach(function(children) {

            for(i = 0; i < timeControl.length; i++) {
                if(timeControl[i].includes(children.innerText.replace(/\s+/g, ''))) {
                    children.className = "clickedElement";
                }
            }

            });
        });
    }
}

//Initizalize event listeners and class for table elements
function initTableData() {

    document.getElementById("parentTable").childNodes.forEach(function(element) {
        element.childNodes.forEach(function(children) {
            children.className = "unclickedElement";
            
            children.addEventListener('click', function() {
                if(children.innerText == "All" && children.className == "unclickedElement") {
                    acceptAll = true;
                    resetTable();
                } else {
                    acceptAll = false;
                    document.getElementById("allId").className = "unclickedElement";
                    timeControl.remove("All");
                }

                //Toggles buttons when clicked
                if(children.className == "clickedElement") {
                    children.className = "unclickedElement";
                    timeControl.remove(children.innerText.replace(/\s+/g, ''));
                } else if(children.className == "unclickedElement") {
                    children.className = "clickedElement";
                    timeControl.push(children.innerText.replace(/\s+/g, ''));
                }

                //Pushes the time control array to Chrome storage API to be loaded later
                chrome.storage.sync.set({"clickedElements": timeControl});

            });
        });
    });

}

//Document listener for Shift keypresses
//If Shift is pressed, multiple table elements can be selected
function addListener() {
    document.addEventListener('keydown', function(event) {

        const key = event.key;
        if(key == "Shift") {
            shiftPressed = true;
        }

    });
    document.addEventListener('keyup', function(event) {

        const key = event.key;
        if(key == "Shift") {
            shiftPressed = false;
        }

    });
}

//Clears table if "All" is selected
function resetTable() {

    document.getElementById("parentTable").childNodes.forEach(function(element) {
        element.childNodes.forEach(function(children) {

            if(children.innerText == "All") {} else {
                timeControl.remove(children.innerText.replace(/\s+/g, ''));
                children.className = "unclickedElement";
            }

        });
    });
}

//Toggles between table visible/hidden on button click
function toggleList() {

    var list = document.getElementById("parentTable");

    if(list) {
        if(list.style.display === "none") {
            document.getElementById("parentTable").style.display = "";
        } else {
            document.getElementById("parentTable").style.display = "none";
        }
    }

}

//Checks if challenge element is loaded, and loads page functions
function loadContainer() {

    //Gets the previously clicked time controls from Chrome storage API
    chrome.storage.sync.get("clickedElements", function(result) {
        timeControl = result.clickedElements;
    });

  e = document.getElementById(CHALLENGE_MENU_TOGGLE_ID);
  if (!e) {
    console.error("lichessARC could not find challenge menu toggle (element with id " + CHALLENGE_MENU_TOGGLE_ID + ")");
  }
  e.click(); // open challenges menu
  e.click(); // close challenges menu
}

//Checks if page is loaded
function initWhenContainerLoaded() {
  var container = document.getElementById(CHALLENGES_CONTAINER_ID);
  if (!container) {
    console.error("lichessARC could not find challenges container (element with id " + CHALLENGES_CONTAINER_ID + ")");
  }
  if (container.className.indexOf("rendered") > 0) {
    init(container);
  } else {
    loadContainer();
    setTimeout(initWhenContainerLoaded, 100);
  }
}

initWhenContainerLoaded();
