const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

// Middleware to handle CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read users data from file
let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function (err, data) {
  console.log('Reading file ...');
  if (err) throw err;
  users = JSON.parse(data);

  // Middleware to add users data to the request object
  app.use(addMsgToRequest);

  // Route to get usernames
  app.get('/read/usernames', (req, res) => {
    if (!users) {
      return res.status(404).json({ error: 'Users not found' });
    }
    let usernames = users.map(function (user) {
      return { id: user.id, username: user.username };
    });
    res.send(usernames);
  });

  // Route to add a new user
  app.post('/write/adduser', (req, res) => {
    if (!users) {
      return res.status(404).json({ error: 'Users not found' });
    }
    let newuser = req.body;
    users.push(newuser);
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(users), (err) => {
      if (err) console.log('Failed to write');
      else console.log('User Saved');
    });
    res.send('done');
  });

  // Start the server after reading the file
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

// Middleware to add users data to the request object
const addMsgToRequest = function (req, res, next) {
  if (users) {
    req.users = users;
    next();
  } else {
    return res.status(404).json({
      error: { message: 'Users not found', status: 404 }
    });
  }
};
