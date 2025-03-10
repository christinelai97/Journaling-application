//require packages to use in app
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//sample content for home, about and contacts page
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

//call express module
const app = express();

//set EJS view engine
app.set('view engine', 'ejs');

//use body parser and express to allow static pages in public folder
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//initialize connections to mongodb using mongoose
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//creating schema / object for mongodb
const entrySchema = {
  title: String,
  content: String
};

//creates new mongodb collection
const Entry = mongoose.model("Entry", entrySchema);

//get request for home page
//renders home.ejs file
//passes starting content and entries to ejs file from mongodb
app.get("/", function(req, res){

  Entry.find({}, function(err, entries){
    res.render("home", {
      startingContent: homeStartingContent,
      entries: entries
      });
  });
});

//get request for compose page
//renders compose.ejs
app.get("/compose", function(req, res){
  res.render("compose");
});

//creates new entries
app.post("/compose", function(req, res){
  const entry = new Entry({
    title: req.body.entryTitle,
    content: req.body.entryBody
  });


  //saves new entry to collection in mongodb
  //redirects to home page if no errors
  entry.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


//get request for existing entries 
app.get("/entries/:entryId", function(req, res){

//constant for getting requested entry ID
const requestedEntryId = req.params.entryId;

  //finds the designated entry in mongodb collection
  Entry.findOne({_id: requestedEntryId}, function(err, entry){
    res.render("entry", {
      title: entry.title,
      content: entry.content
    });
  });

});

//post request for update button
//displays entry title and content inside text field
app.post("/updating", function(req, res) {

  const requestedEntryId = req.params.entryId;

  Entry.findOne({_id: requestedEntryId}, function(err, entry){
    res.render("update", {
      title: entry.title,
      content: entry.content
    });
  });
})

//post request for updated entry
app.post("/update", function(req,res) {

  const updatedEntry = {
    title: req.body.entryTitle,
    content: req.body.entryBody
  }

  Entry.findOneAndUpdate({_id: requestedEntryId}, updatedEntry, function(err, entry) {
    res.render("entry", {
      title: entry.title,
      content: entry.content
    });
  });
})

//post route for deleting item
//redirects to home page
app.post("/delete", function(req,res) {

  const requestedEntryId = req.params.entryId;
  Entry.delteOne({_id: requestedEntryId}).exec();
  res.redirect("/");


})

//get request for about sections
//renders about.ejs with designated variables
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
