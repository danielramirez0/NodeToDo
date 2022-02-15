//jshint esversion:6

const express = require("express");
// body-parser is deprecated in latest node, use urlencoded extended tru and express.json
// const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// app.use(express.static(__dirname + "/public/")) //resource from another location
// app.use("view engine", "ejs");
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

const day = date.getDate();

  res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function () {
    console.log("Server started on port " + port);
  });
