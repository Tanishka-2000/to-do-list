const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');


mongoose.connect('mongodb://localhost:27017/todolist');
const itemsSchema = {
  name:{
    type:String,
    required:true
  }
};
const Item = mongoose.model('Item',itemsSchema);

const listSchema = {
  name:String,
  items:[itemsSchema]
};
const List = mongoose.model('List',listSchema);
// Item.insertMany([item1, item2, item3], function(err){
//   if(err){ console.log("An error occurred.")}
//   else{ console.log("Successfully saved to database.");}
// });

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

const item1 = new Item({name:"Welcome to the To do list."});
const item2= new Item({name:"Hit this + button to add items."});
const item3 = new Item({name:"<-- Hit this to delete any item."});

const defaultItems = [item1, item2, item3];

app.get('/',function(req,res){
  Item.find({},function(err,items){
    if(items.length === 0){
        res.render("list",{title:"Today", listItem: defaultItems});
    }else{
        res.render("list",{title:"Today", listItem: items});
      }
  });
});

app.post('/',function(req,res){
  let item = req.body.newItem;
  let title = req.body.button;
  const newItem = new Item({name: item});

  if(title === "Today"){
    newItem.save();
    res.redirect('/');
  }else{
    List.findOne({name:title}, function(err, foundItem){
      if(!err){
            if(!foundItem){
              let list = new List({
                name:title,
                items: [newItem]
              });
              list.save();
            }else{
            foundItem.items.push(newItem);
            foundItem.save();
            }
        res.redirect('/' + title);
    }
  });
  }

});

app.post('/delete',function(req,res){
  let checkedItemId = req.body.checkbox;
  let listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect('/');
      }
    });
  }else{
    List.findOneAndUpdate({name:listName},{$pull: {items: {_id: checkedItemId}}},function(err,result){
      if(!err){
        res.redirect('/'+ listName);
      }
    });
  }

});


app.get('/:customListName', function(req, res){
  let customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, function(err, foundItem){
    if(!err){
      if(!foundItem){
        res.render("list",{title:customListName, listItem: defaultItems});
      }else{
        res.render("list",{title:customListName, listItem: foundItem.items});
      }
  }
});
  });

app.get('/about',function(req,res){
  res.render("about");
});



app.listen(3000,function(){
  console.log("Server starting at port 3000...");
});
