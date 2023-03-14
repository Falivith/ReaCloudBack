const express = require('express');
const app = express();
const path = require('path');
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');



app.use(cors());
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);




module.exports = app



