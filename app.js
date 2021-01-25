const bodyParser = require('body-parser');
const express = require('express');
const date = require(__dirname+'/date.js')
const app = express();

let items = ['work', 'eat', 'study'];
let workItemsArr = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function (req, res) {
 let day = date.getDate();

  res.render('list', { listTitle: day, newItem: items });
});

app.post('/', (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === 'Work') {
    workItemsArr.push(item);
    res.redirect("/work")
  } else {
    items.push(item);
    res.redirect("/")
  }
});
app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newItem: workItemsArr });
});
app.get("/about",(req,res) => {
  res.render("about");
})
app.listen(3000, function () {
  console.log('Server started on port 3000.');
});
