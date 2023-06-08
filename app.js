
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Define a schema for the data
const dataSchema = new mongoose.Schema({
  name: String,
  time: String,
  date: String
});

// Create a model based on the schema
const Data = mongoose.model('Data', dataSchema);
mongoose.set('strictQuery', true);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/v1.html');
});

app.get('/generate', function (req, res) {
  res.sendFile(__dirname + '/generate.html');
});

function getPresentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Usage
// const presentDate = getPresentDate();

app.post('/compose', function (req, res) {
  const newData = new Data({
    name: req.body.paragraph,
    time: new Date().toLocaleTimeString(),
    date: getPresentDate()
  });

  // Save the data to MongoDB
  newData.save()
    .then(() => {
      console.log('Data saved:', newData);
      res.redirect('/');
    })
    .catch((error) => {
      console.error('Error saving data:', error);
      res.redirect('/');
    });
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
