const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const date = require(__dirname + "/date.js");

const items = ["Buy Food","Cook Food","Eat Food"];
const workItems = [];
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/',function(req,res){

  let day = date.getDate();
  res.render("list",{title:day, listItem: items});
});

app.get('/work',function(req,res){
  res.render("list",{title:"Work List", listItem:workItems})
})

app.get('/about',function(req,res){
  res.render("about");
})

app.post('/',function(req,res){
  let item = req.body.newItem;

  if(req.body.button === "Work List"){
    workItems.push(item);
    res.redirect("/work");
  }else{
    items.push(item);
    res.redirect('/');
  }
});

app.listen(3000,function(){
  console.log("Server starting at port 3000...");
});
