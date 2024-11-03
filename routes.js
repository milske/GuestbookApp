var express = require("express");
var fs = require("fs");
var app = express();
app.use("/images", express.static("images"));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); // for parsing
app.use(bodyParser.json()); // For JSON handling in AJAX requests

// serve the form page
app.get("/newmessage", function (req, res) {
  res.status(200).sendFile(__dirname + "/form.html");
});

// Serve the AJAX form at /ajaxmessage
app.get("/ajaxmessage", function (req, res) {
  res.status(200).sendFile(__dirname + "/ajaxform.html");
});

//route for form sending the POST data
app.post("/newmessage", function (req, res) {
  var { username, country, message } = req.body;

  if (!username || !country || !message) {
    return res
      .status(400)
      .send("All fields are required. Please fill in all fields.");
  }

  // read the current JSON data
  var data = require("./guestbook.json");

  // Append the new message data
  data.push({
    username: req.body.username,
    country: req.body.country,
    date: new Date(),
    message: req.body.message,
  });

  //convert the json object to a string format
  var jsonStr = JSON.stringify(data);

  //write data to the file
  fs.writeFile("guestbook.json", jsonStr, (err) => {
    if (err) throw err;
    console.log("It's saved");
  });
  res.status(200).json(data);
});

// post for ajax form
app.post("/ajaxmessage", function (req, res) {
  var { username, country, message } = req.body;

  if (!username || !country || !message) {
    return res
      .status(400)
      .send("All fields are required. Please fill in all fields.");
  }

  // read the current JSON data
  var data = require("./guestbook.json");

  // Append the new message data
  data.push({
    username: req.body.username,
    country: req.body.country,
    date: new Date(),
    message: req.body.message,
  });

  //convert the json object to a string format
  var jsonStr = JSON.stringify(data);

  //write data to the file
  fs.writeFile("guestbook.json", jsonStr, (err) => {
    if (err) throw err;
    console.log("It's saved");
  });
  res.status(200).json(data);
});

app.get("/", function (req, res) {
  res.status(200).sendFile(__dirname + "/index.html");
});

app.get("/jsondata", function (req, res) {
  res.status(200).sendFile(__dirname + "/guestbook.json");
});

app.get("/guestbook", function (req, res) {
  var data = require("./guestbook.json");

  var results = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <div class="container my-4">
      <h2 class="text-center mb-4">Guestbook Entries</h2>
      <table class="table table-bordered table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Username</th>
            <th>Country</th>
            <th>Date</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
  `;
  for (let i = 0; i < data.length; i++) {
    results += `
      <tr>
        <td>${data[i].username}</td>
        <td>${data[i].country}</td>
        <td>${data[i].date}</td>
        <td>${data[i].message}</td>
      </tr>
    `;
  }

  results += `
        </tbody>
      </table>
    </div>
  `;
  res.status(200).send(results);
});

app.get("/*", function (req, res) {
  res.status(404).send("Cant find the page requested");
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
