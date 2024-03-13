const express = require('express');
const router = express.Router();

router.get('/username/:name', (req, res) => {
  const username = req.params.name;
  const user = req.users.find(user => user.username === username);
  if (user) {
    res.json({ email: user.email });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.get('/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

module.exports = router;
