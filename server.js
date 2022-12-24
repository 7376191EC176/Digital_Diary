// Backend integration with the API calls
// Backend integration for the digital diary

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

//to access the static files
app.use(express.static(__dirname));

//bodyParser to parse the data
app.use(bodyParser.urlencoded({ extended: true }));

//converting the parsed data to json format
app.use(bodyParser.json());

//the initial load of the file is directed to the index.html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//to store the details of new user for the further access of the account
app.post("/signup", (req, res) => {
  fs.writeFile(`./data/user/${req.body.userID}.json`, `{}`, () => {});
  let data = fs.readFileSync("./data/users.json", "utf8");
  data = JSON.parse(data);

  //if the userID already exist, initmate the user
  if (req.body.userID in data) {
    res.status(404).send("user exist");
    res.end();
  }

  // if the userID is new, then add the user details
  else {
    data[req.body.userID] = req.body.password1;
    data = JSON.stringify(data);

    // to write the user info to the data file - user.json
    fs.writeFile("./data/users.json", data, () => {
      res.status(200).send("user added");
      res.end();
    });
  }
});

//to validate the login and provide access if the data given is valid. ie, userID and password
app.post("/login", (req, res) => {
  let data = fs.readFileSync("./data/users.json", "utf8");
  data = JSON.parse(data);
  let userID = req.body.userID;

  // if the userID is present is the data, then validate password
  if (userID in data) {
    // if userID and password are matched with the database
    if (data[userID] == req.body.password) {
      res.status(200).send("login success");
      res.end();
    }

    // if the password is not matched with the data initimate user
    else {
      res.status(404).send("invalid login");
      res.end();
    }
  }

  // if the userID not exists, intimate user
  else {
    res.status(404).send("invalid login");
    res.end();
  }
});

//to add special events which are to be remaind
//special ocassions can be added in this list
app.post("/addevent", (req, res) => {
  let data = fs.readFileSync(`./data/user/${req.body.userID}.json`, "utf8");
  data = JSON.parse(data);
  let user = req.body.userID;
  let date = req.body.date;
  let event = req.body.event;

  // to check whether the user has update event already
  if (data.event) {
    // check whether the event has been added for that particular date
    if (date in data.event) {
      data.event[date][event] = event;
    }

    //if this is the first event entered for that date
    else {
      data.event[date] = { [event]: event };
    }
  }

  // user who have not updated event before
  else {
    data = { event: { [date]: { [event]: event } } };
  }
  data = JSON.stringify(data);

  //write the event in the data
  fs.writeFile(`./data/user/${user}.json`, data, () => {
    res.status(200).send("Event added");
    res.end();
  });
});

// to fetch the list of events for 3 days (today,tomorrow,next day)
app.get("/fetchevent", (req, res) => {
  // to read the data for that particular user and fetch the special event list
  let data = fs.readFileSync(`./data/user/${req.query.user}.json`, "utf8");
  data = JSON.parse(data);

  //get the date
  let date = new Date();
  let date1 = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  let date2 = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);

  //convert date to required format
  date =
    date.getFullYear() +
    "-" +
    (parseInt(date.getMonth()) + 1) +
    "-" +
    date.getDate();
  date1 =
    date1.getFullYear() +
    "-" +
    (parseInt(date1.getMonth()) + 1) +
    "-" +
    date1.getDate();
  date2 =
    date2.getFullYear() +
    "-" +
    (parseInt(date2.getMonth()) + 1) +
    "-" +
    date2.getDate();

  // if event is present fetch the data. ie, events for the following days
  if (data.event) {
    let eventList = {
      [date]: data.event[date],
      [date1]: data.event[date1],
      [date2]: data.event[date2],
    };
    res.json(eventList);
  }

  //if there is no event present
  else {
    res.json("0");
  }
  res.end();
});

//to add the daily info which is feeded by the user
app.post("/addTodayInfo", (req, res) => {
  // read the contents in the user file which contains all the users data
  let data = fs.readFileSync(`./data/user/${req.body.user}.json`, "utf8");
  data = JSON.parse(data);

  // functions to get the date
  let date = new Date();
  let date1 = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  let amountSpend = req.body.todayInfo.amountSpend;

  // if it is not the start of new month
  if (data.expense && date.getMonth() === date1.getMonth()) {
    data.expense = parseInt(data.expense) + parseInt(amountSpend);
  }

  // if it is the start of new month
  else {
    data.expense = amountSpend;
  }
  date =
    date.getFullYear() +
    "-" +
    (parseInt(date.getMonth()) + 1) +
    "-" +
    date.getDate();

  // if the value is updated and the spend amount is varied
  if (data[date]) {
    data.expense = parseInt(data.expense) - parseInt(data[date].amountSpend);
  }
  data[date] = req.body.todayInfo;
  data = JSON.stringify(data);

  // to write the data along with the user input
  fs.writeFile(`./data/user/${req.body.user}.json`, data, () => {
    res.status(200).send("Event added");
    res.end();
  });
});

// to fetch the expense spend from the database
app.get("/expense", (req, res) => {
  let data = fs.readFileSync(`./data/user/${req.query.user}.json`, "utf8");
  data = JSON.parse(data);

  // if the expense value is present
  if (data.expense) {
    res.json(data.expense);
  }

  // the expense of the user is not given from the user till date
  else {
    res.json("0");
  }
  res.end();
});

// to fetch the info of present day - the log of user input
app.get("/todayInfo", (req, res) => {
  //to read the data of user from the file
  let data = fs.readFileSync(`./data/user/${req.query.user}.json`, "utf8");
  data = JSON.parse(data);

  // to get the date of particular day
  let date = new Date();
  date =
    date.getFullYear() +
    "-" +
    (parseInt(date.getMonth()) + 1) +
    "-" +
    date.getDate();

  // if the required data is present return the data
  if (data[date]) {
    res.json(data[date]);
  }

  // if no data is available the "0" is returned for identification
  else {
    res.json("0");
  }
  res.end();
});

// to fetch the search info from the user database
app.get("/dateSearchInfo", (req, res) => {
  // to read the data of user from the file
  let data = fs.readFileSync(`./data/user/${req.query.user}.json`, "utf8");
  data = JSON.parse(data);
  let date = req.query.date;

  // to check whether the data is available for that particular date, if available send the data
  if (data[date]) {
    res.json(data[date]);
  }

  // the data is not available for that particular search return "0" for identification
  else {
    res.json("0");
  }
  res.end();
});

//to fetch all the special events registered by the user
app.get("/fetchAllEvents", (req, res) => {
  let data = fs.readFileSync(`./data/user/${req.query.user}.json`, "utf8");
  data = JSON.parse(data);

  // to check whether the data is available, if available send the data
  if (data.event) {
    res.json(data.event);
  }

  // the data is not available for that particular search return "0" for identification
  else {
    res.json("0");
  }
  res.end();
});

// the server is established at the port number 3456
app.listen(3456);
