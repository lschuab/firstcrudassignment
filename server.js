const app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

// Read (all).
app.get('/users', (req, res) => {
  res.json(getUsers());
});

// Read (individual).
app.get('/users/:id', (req, res) => {
  const users = getUsers();
  for (const user of users) {
    if (user.id === +req.params.id) {
      res.json(user);
    }
  }
  res.sendStatus(404);
});

// Create
app.post('/users', (req, res) => {
  const newUser = req.body;
  if (!newUser) {
    res.sendStatus(400);
  }
  newUser.id = getNextID();
  const users = getUsers();
  users.push(newUser);
  setUsers(users);
  res.json(newUser);
});

// Update
app.put('/users/:id', (req, res) => {
  const updatedUser = req.body;
  if (!updatedUser) {
    res.sendStatus(400);
  }
  const users = getUsers();
  for (let user of users) {
    if (user.id === + req.params.id) {
      user = updatedUser;
      user.id = req.params.id;
      setUsers(users);
      res.json(user);
    }
  }
  res.sendStatus(404);
});

// Delete
app.delete('/users/:id', (req, res) => {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === + req.params.id) {
      const deletedUser = users.splice(i, 1)[0];
      setUsers(users);
      res.json(deletedUser);
    }
  }
  res.sendStatus(404);
});



app.listen(port, function() {
  console.log('Listening on', port);
});


function getUsers() {
  return JSON.parse(fs.readFileSync('./storage.json', 'utf8')).users;
}

function setUsers(updatedUsers) {
  let content = JSON.parse(fs.readFileSync('./storage.json', 'utf8'));
  content.users = updatedUsers;
  fs.writeFileSync('./storage.json', JSON.stringify(content));
}

function getNextID() {
  let content = JSON.parse(fs.readFileSync('./storage.json', 'utf8'));
  content.nextID++;
  fs.writeFileSync('./storage.json', JSON.stringify(content));
  return content.nextID;
}
