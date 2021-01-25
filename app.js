const bodyParser = require('body-parser');
const express = require('express');

const app = express();

let items = ['work', 'eat', 'study'];
let workItemsArr = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', function (req, res) {
  let date = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  let day = date.toLocaleDateString('en-US', options);

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
app.listen(3000, function () {
  console.log('Server started on port 3000.');
});
