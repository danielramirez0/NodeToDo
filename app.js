//jshint esversion:6
require("dotenv").config()
const mongoose = require("mongoose");
const _ = require("lodash");
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
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect(process.env.MONGO_CONNECTION);

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "This is a to-do list",
});

const item2 = new Item({
  name: "Hit + to add a new item",
});

const item3 = new Item({
  name: "<-- check to delete",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", async function (req, res) {
  //   const day = date.getDate();
  const items = await Item.find({});
  if (items.length === 0) {
    Item.insertMany(defaultItems, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully added default items");
      }
    });
    res.redirect("/");
  } else {
    res.render("list", { listTitle: "Today", newListItems: items });
  }
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, list) {
      list.items.push(newItem);
      list.save();
      res.redirect(`/${listName}`);
    });
  }
});

app.post("/delete", function (req, res) {
  const id = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(id, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: id } } },
      function (err, list) {
        if (!err) {
          res.redirect(`/${listName}`);
        }
      }
    );
  }
});

app.get("/:title", function (req, res) {
  const title = _.capitalize(req.params.title);
  List.findOne({ name: title }, function (err, list) {
    if (!err) {
      if (!list) {
        const list = new List({
          name: title,
          items: defaultItems,
        });

        list.save();
        res.redirect(`/${title}`);
      } else {
        res.render("list", { listTitle: list.name, newListItems: list.items });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(port, function () {
  console.log("Server started on port " + port);
});
