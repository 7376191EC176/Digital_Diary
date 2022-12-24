// javascript file for the digital diary

// functions imported from the digital-diary-api.jf file
// all the api class are imported
import {
  fetchCompleteList,
  getSearchInfo,
  fetchTodayInfo,
  fetchExpense,
  addTodayInfoToJSON,
  fetchEventList,
  addEventToJSON,
  addDataToJSON,
  userLogin,
} from "./digital-diary-api.js";

// self calling function to enable all the event listners
(() => {
  // display signup page on click of the signup button present in the login page
  document.getElementById("signup").addEventListener("click", displaySignUp);

  // display login page on click of the login button present in the signup page
  document.getElementById("login").addEventListener("click", displayLogin);

  // to validate the userID and password feeded by the user when the user click on the submit button present in the login page.
  document
    .getElementById("login-submit")
    .addEventListener("click", validateLogin);

  // to add the user account by the data given by the user when the user click on the submit button present in the signup page.
  document
    .getElementById("signup-submit")
    .addEventListener("click", validateSignup);
})();

// to hide the login page and display signup page
function displaySignUp() {
  document.getElementById("login-info").style.display = "none";
  document.getElementById("signup-info").style.display = "flex";
}

// to hide the signup page and display login page
function displayLogin() {
  document.getElementById("login-info").style.display = "flex";
  document.getElementById("signup-info").style.display = "none";
}

// to validate the login info given by the user
// if validation is success the homepage will be displayed to the user
async function validateLogin() {
  let userinput = {
    userID: document.getElementById("login-userid").value,
    password: document.getElementById("login-password").value,
  };

  // if the userID and password entered is not null then proceed with the validation
  if (userinput.userID && userinput.password) {
    // api call to verify whether the user exist
    let loginSuccess = await userLogin(userinput);

    // if the user validation is success then redirect to the home page
    if (loginSuccess == "success") {
      displayHomePage(userinput.userID);
    }
    document.getElementById("login-userid").value = "";
    document.getElementById("login-password").value = "";
  }

  // if the data is not valid form of data the alert the user
  else {
    alert("Enter valid data");
  }
}

// to validate the signup by verifying the user data provided
async function validateSignup() {
  let userinput = {
    userID: document.getElementById("signup-userid").value,
    password1: document.getElementById("signup-password1").value,
    password2: document.getElementById("signup-password2").value,
  };

  // check whether the user inputs are valid
  if (
    userinput.userID.length >= 8 &&
    userinput.password1.length >= 8 &&
    userinput.password2
  ) {
    // check whether the passwords entered are matched
    if (userinput.password1 == userinput.password2) {
      // api call to add new user
      let loginSuccess = await addDataToJSON(userinput);

      // if the user is added successfully the redirect to the homepage
      if (loginSuccess == "success") {
        displayHomePage(userinput.userID);
      }
    }

    // if the password enter is not same alert the user
    else {
      alert("Password mis-match");
    }
    document.getElementById("signup-userid").value = "";
    document.getElementById("signup-password1").value = "";
    document.getElementById("signup-password2").value = "";
  }

  // if the entered is not valid alert the user
  else {
    alert("Enter valid data and should contain 8 characters");
  }
}

// function to display the home page
function displayHomePage(user) {
  document.getElementById("login-signup").style.display = "none";
  document.getElementById("home-page").style.display = "grid";
  document.getElementById("username").innerHTML = user;

  // function to add all the events to search based on event datalist
  listEvents();

  //add event if the add event is clicked along with valid data input
  document
    .getElementById("add-special-event")
    .addEventListener("click", addEvent);

  // save the today info in the digital diary database if save button is clicked
  document.getElementById("save").addEventListener("click", saveTodayInfo);

  //display the events which are going to occur within 2 days so as to plan accordingly
  displayEventList(user);

  // logout the user if the logout icon is clicked
  document.getElementById("logout").addEventListener("click", () => {
    if (confirm("Do u want to logout")) {
      location.reload();
    }
  });

  //update the expense value for this particular month
  updateExpense(user);

  // display the today info if any data is saved and stored already
  displayTodayInfo(user);

  // to display the search tab if search button is clicked
  document.getElementById("search").addEventListener("click", displaySearch);

  // to display the today info if today button is clicked
  document.getElementById("today").addEventListener("click", displayToday);

  // to display the data for the particular date which is updated by the user
  document.getElementById("date").addEventListener("change", searchByDate);

  // to display the data of the date when a particular event is registered
  document
    .getElementById("special-events")
    .addEventListener("change", searchByEvent);
}

// add the special event to be remaind to the user database
async function addEvent() {
  let userinput = {
    userID: document.getElementById("username").innerHTML,
    date: document.getElementById("event-date").value,
    event: document.getElementById("event-name").value,
  };

  // check whether the input given is valid
  if (userinput.date && userinput.event) {
    // api call to add the new user to the database and create a new user account
    await addEventToJSON(userinput);
    document.getElementById("event-date").value = "";
    document.getElementById("event-name").value = "";

    // to update the list of events present
    displayEventList(userinput.userID);
  }

  // if the data entered is invalid alert user
  else {
    alert("Data invalid");
  }

  // to update the datalist which contains events
  listEvents();
}

// to display the list of events which is on the 3 days
async function displayEventList(user) {
  const card = document.querySelector(".event-card");
  const cloneCard = document.getElementById("special-event-list");
  const content = document.getElementsByClassName("event-card");

  // api call to fetch the events which are for following 2 days
  let eventList = await fetchEventList(user);
  eventList = await eventList.json();
  let iterate = 1;

  // replace the event card to display the new content
  cloneCard.replaceChildren();

  // create card and append the list of events
  for (const date in eventList) {
    if (eventList[date] && eventList != "0") {
      for (const event in eventList[date]) {
        cloneCard.appendChild(card.cloneNode(true));
        content[iterate].innerHTML = date + "  :  " + eventList[date][event];
        iterate++;
      }
    }
  }
}

// to save the today info entered by the user
async function saveTodayInfo() {
  let userInput = {
    user: document.getElementById("username").innerHTML,
    todayInfo: {
      progressIndex: document.getElementById("progress-index-value").value,
      amountSpend: document.getElementById("amount-spend-value").value,
      eventList: document.getElementById("list-of-events").value,
      generalInfo: document.getElementById("general-notes").value,
    },
  };

  // check if all the user inputs are valid
  if (
    userInput.todayInfo.progressIndex &&
    userInput.todayInfo.amountSpend &&
    userInput.todayInfo.eventList &&
    userInput.todayInfo.generalInfo
  ) {
    // api call to add the user data to the json file
    await addTodayInfoToJSON(userInput);

    // call to update the expense amount spend for that particular month with respect to the user data
    await updateExpense(userInput.user);
  }

  // if the user input are not valid, intimate the user
  else {
    alert("Enter valid data");
  }
}

// update the expense amount with respect to the user input
async function updateExpense(user) {
  // api call to fetch the expense from the user database
  let expense = await fetchExpense(user);
  expense = await expense.json();
  document.getElementById("expense").innerHTML = expense + " Rs";
  return;
}

// display the user data provided for that particular day if any is present
async function displayTodayInfo(user) {
  // api call to fetch the data for that particular day from the user database
  let todayInfo = await fetchTodayInfo(user);
  todayInfo = await todayInfo.json();

  // if the api call returns the value update it in the UI
  if (todayInfo != "0") {
    document.getElementById("progress-index-value").value =
      todayInfo.progressIndex;
    document.getElementById("amount-spend-value").value = todayInfo.amountSpend;
    document.getElementById("list-of-events").value = todayInfo.eventList;
    document.getElementById("general-notes").value = todayInfo.generalInfo;
  }
  return;
}

// to display the search tab
async function displaySearch() {
  document.getElementById("update").style.display = "none";
  document.getElementById("search-tab").style.display = "flex";
  document.getElementById("today").style.backgroundColor = "#cd5175a6";
  document.getElementById("search").style.backgroundColor = "#cd5175";

  // to update the data in the search tab to null since no input is feeded to search
  displayNull();
}

// to display initial value at the start
async function displayNull() {
  document.getElementById("progress-index-value").value = "";
  document.getElementById("amount-spend-value").value = "";
  document.getElementById("list-of-events").value = "";
  document.getElementById("general-notes").value = "";
  document.getElementById("date").value = "";
  document.getElementById("special-events").value = "";
}

// to search the data based on date provided by the user
async function searchByDate() {
  await searchData(document.getElementById("date").value);
  document.getElementById("special-events").value = "";
  return;
}

// to search the data and update the UI with the data fetched
async function searchData(date) {
  let userInfo = {
    user: document.getElementById("username").innerHTML,
    date: date,
  };

  // to search the data from the input provided by the user
  let searchInfo = await getSearchInfo(userInfo);
  searchInfo = await searchInfo.json();

  // update the UI if the data is provided by the api call
  if (searchInfo != "0") {
    // to change the input given to not editable mode
    updateInputState(true);
    document.getElementById("progress-index-value").value =
      searchInfo.progressIndex;
    document.getElementById("amount-spend-value").value =
      searchInfo.amountSpend;
    document.getElementById("list-of-events").value = searchInfo.eventList;
    document.getElementById("general-notes").value = searchInfo.generalInfo;
  }

  // alert the user if there is no data in the database with the respected input provided
  else {
    alert("No data available for the select");

    // to display the UI with initial value
    displayNull();
  }
  return;
}

// to update the state of input box to editable and not editable based on the search or today info mode
async function updateInputState(state) {
  document.getElementById("progress-index-value").readOnly = state;
  document.getElementById("amount-spend-value").readOnly = state;
  document.getElementById("list-of-events").readOnly = state;
  document.getElementById("general-notes").readOnly = state;
}

// to add the special event list to the datalist
async function listEvents() {
  // api call to fetch the complete special event list from the user data
  let listOfEvents = await fetchCompleteList(
    document.getElementById("username").innerHTML
  );
  listOfEvents = await listOfEvents.json();
  const eventDatalist = document.getElementById("special-events-list");
  eventDatalist.replaceChildren();

  // to add special events to the datalist for the user to select
  for (const date in listOfEvents) {
    for (const event in listOfEvents[date]) {
      const options = document.createElement("OPTION");
      options.value = listOfEvents[date][event];
      eventDatalist.appendChild(options);
    }
  }
}

// display the today tab and display if today info is present already
async function displayToday() {
  document.getElementById("update").style.display = "flex";
  document.getElementById("search-tab").style.display = "none";
  document.getElementById("search").style.backgroundColor = "#cd5175a6";
  document.getElementById("today").style.backgroundColor = "#cd5175";

  // to update the input state to editable mode
  await updateInputState(false);

  // to display the initial value to the input tabs
  await displayNull();

  // to display today data in the UI
  await displayTodayInfo(document.getElementById("username").innerHTML);
}

// to search the data of particular day based on event search with the input provided by the user
async function searchByEvent() {
  // api call to find the date of event entered
  let listOfEvents = await fetchCompleteList(
    document.getElementById("username").innerHTML
  );
  listOfEvents = await listOfEvents.json();

  // to get the date of the event with the help of event name
  let date = getKeyByValue(
    listOfEvents,
    document.getElementById("special-events").value
  );
  document.getElementById("date").value = date;

  // fetch the data for the particular date of occurance of event
  await searchData(date);
}

// get the key for the value with the entire object
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key][value] === value);
}
