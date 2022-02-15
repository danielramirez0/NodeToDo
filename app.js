const express = require("express");

// body-parser is deprecated in latest node, use urlencoded extended tru and express.json
// const bodyParser = require("body-parser");

const app = express();

// app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public/")) //resource from another location
// app.use("view engine", "ejs");
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

// let items = [];
let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, listItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.listen(port, function () {
  console.log("Server started on port " + port);
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", listItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/work", function (req, res) {
  workItems.push(req.body.newItem);
  res.redirect("/work");
});
