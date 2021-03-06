/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Journal = require("./models/journal");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/journal/delete", (req, res) => {
  Journal.deleteMany(req.body).then((journal) => res.send(journal));
});

router.get("/journal", (req, res) => {
  // empty selector means get all documents
  Journal.find(req.query).then((journal) => res.send(journal));
});

router.post("/journal", (req, res) => {
  Journal.findOneAndUpdate({owner: req.body.owner, day: req.body.day, month: req.body.month, year: req.body.year}, req.body, {upsert: true}).then((journal) => res.send(journal));
});

router.post("/moods/delete", (req, res) => {
  Journal.updateMany({owner: req.body._id}, { $pull: { moods: { name: req.body.moodName } } }).then((journal) => res.send(journal));
});

router.post("/moods/edit", (req, res) => {
  Journal.updateMany({owner: req.body._id},
  { $set: { 
    "moods.$[elem].emoji" : req.body.emoji,
    "moods.$[elem].name" : req.body.name,
  } },
  {
    arrayFilters: [ { "elem.name": req.body.prevName } ]
  }).then((journal) => res.send(journal));
});

router.post("/moods/merge", (req, res) => {
  Journal.updateMany({owner: req.body._id, "moods.name": req.body.name }, { $pull: { moods: { name: req.body.prevName } } })
  .then((journal) => res.send(journal));
});

router.post("/users/delete", (req, res) => {
  User.deleteOne(req.body).then((user) => res.send(user));
});

router.get("/users", (req, res) => {
  // empty selector means get all documents
  User.findOne(req.query).then((user) => res.send(user));
});

router.post("/users", (req, res) => {
  User.findOneAndUpdate({_id: req.body._id}, req.body).then((user) => res.send(user));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
