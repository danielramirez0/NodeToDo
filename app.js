const express = require("express");

// body-parser is deprecated in latest node, use urlencoded extended tru and express.json
// const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
// app.use(express.static(__dirname + "/public/")) //resource from another location
// app.use("view engine", "ejs");
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

// let items = [];
let items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  //   let currentDay = today.getDay();
  //   let day = "";

  //   switch (currentDay) {
  //     case 0:
  //       day = "Sunday";
  //       break;
  //     case 1:
  //       day = "Monday";
  //       break;
  //     case 2:
  //       day = "Tuesday";
  //       break;
  //     case 3:
  //       day = "Wednesday";
  //       break;
  //     case 4:
  //       day = "Thursday";
  //       break;
  //     case 5:
  //       day = "Friday";
  //       break;
  //     case 6:
  //       day = "Saturday";
  //       break;
  //     default:
  //       console.log("Error: current day is equal to: " + currentDay);
  //       break;
  //   }
  //   if (today.getDay() === 6 || today.getDay() === 0) {
  //   if (currentDay === 6 || currentDay === 0) {
  // day = "Weekend";
  // res.send("<h1>Yay it's the weekend!</h1>");
  //   }
  //   } else {
  // day = "Weekday";

  // NOTE: Send is s dead stop. Server will end instructions and send result
  // res.send("<h1>Boo! I have to work!</h1>");

  // NOTE: Multiple lines of can be sent using res.write
  // res.write("<p>It is not the weekend.</p>");
  // res.write("<h1>Boo! I have to work!</h1>");
  // res.send()

  //NOTE: HTML files can be sent instead of multiple write lines
  // res.sendFile(__dirname + "/index.html");
  //   }
  res.render("list", { kindOfDay: day, listItems: items });
});

app.post("/", function (req, res) {
  // let item = req.body.newItem
  items.push(req.body.newItem)

  // res.render("list", {newListItem: item})
  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server started on port " + port);
});
