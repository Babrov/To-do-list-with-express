const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash')

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
});

const itemSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name: 'Work',
});
const item2 = new Item({
  name: 'eat',
});
const item3 = new Item({
  name: 'sleep',
});

const itemsArr = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model('List',listSchema)

app.get('/', function (req, res) {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(itemsArr, (err) =>
        err ? console.log(err) : 'saved to DB'
      );
      res.redirect('/');
    } else {
      res.render('list', { listTitle: 'Today', newItem: foundItems });
    }
  });
});

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, (err,foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: itemsArr
        })
        list.save()
        res.redirect('/' + customListName)
      } else {
        res.render('list', { listTitle: customListName, newItem: foundList.items })
      }
    }
  })
  
});

app.post('/', (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.list;

  const itemNew = new Item({
    name: itemName,
  });
  if (listName === 'Today') {
  itemNew.save();
  res.redirect('/');
  } else {
    List.findOne({name: listName},(err,foundList)=> {
      foundList.items.push(itemNew)
      foundList.save();
      res.redirect('/'+listName);
    })
  }
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId,(err) => err ?  console.log(err) : "")
    res.redirect('/');
  } else {
    List.findOneAndUpdate({name:listName},{$pull: {items: {_id: checkedItemId}}},(err, foundList) => {
      if (!err) {
        res.redirect('/' + listName)
      } 
    })
  }
  

});



app.get('/about', (req, res) => {
  res.render('about');
});
app.listen(3000, function () {
  console.log('Server started on port 3000.');
});
