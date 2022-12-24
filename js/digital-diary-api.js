// contains all the api call function which is making calls to interact with the database

// to validate the user login using the UserID and password provided by the user
async function userLogin(userinput) {
  let login = await fetch("http://localhost:3456/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });

  // if the login is success return "success"
  if (login.ok) {
    return "success";
  }

  //if the login is not successful alert user
  else {
    alert("Invalid User ID or password");
  }
  return;
}

// to add new user account in the user database
async function addDataToJSON(userinput) {
  let signup = await fetch("http://localhost:3456/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });

  // if the signup is successful return "success"
  if (signup.ok) {
    return "success";
  }

  // if the signup is not sucessful alert user
  else {
    alert("UserID exist");
  }
  return;
}

//to add the special event to the database
async function addEventToJSON(userinput) {
  let newEvent = await fetch("http://localhost:3456/addevent", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });

  // if the event added successful intimate user with the alert
  if (newEvent.ok) {
    alert("Event added");
  }

  //if the event is not added alert user
  else {
    alert("Error in adding event");
  }
  return;
}

// get the event list for the next 2 days
async function fetchEventList(user) {
  try {
    let eventList = await fetch(
      `http://localhost:3456/fetchevent/?user=${user}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return eventList;
  } catch {}
}

// to add the today data enter by the user to the database
async function addTodayInfoToJSON(userinput) {
  let addInfo = await fetch("http://localhost:3456/addTodayInfo", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userinput),
  });

  // if the data is added to the database inform user
  if (addInfo.ok) {
    alert("Event added");
  }

  //   if the data is not added to the database alert user
  else {
    alert("Event is already added");
  }
  return;
}

// get the total expense spend for that particular month
async function fetchExpense(user) {
  try {
    let expense = await fetch(`http://localhost:3456/expense/?user=${user}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    return expense;
  } catch {}
}

//get the data of that day to display in UI
async function fetchTodayInfo(user) {
  let todayInfo = await fetch(`http://localhost:3456/todayInfo/?user=${user}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  return todayInfo;
}

// to get the searched data which to be displayed on UI
async function getSearchInfo(userInfo) {
  let todayInfo = await fetch(
    `http://localhost:3456/dateSearchInfo/?user=${userInfo.user}&date=${userInfo.date}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return todayInfo;
}

// to get the list of special events from the user database
async function fetchCompleteList(user) {
  try {
    let eventList = await fetch(
      `http://localhost:3456/fetchAllEvents/?user=${user}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return eventList;
  } catch {}
}

// to export the function to use it in index.js file
export {
  fetchCompleteList,
  getSearchInfo,
  fetchTodayInfo,
  fetchExpense,
  addTodayInfoToJSON,
  fetchEventList,
  addEventToJSON,
  addDataToJSON,
  userLogin,
};
