const express = require('express');
const app = express();
const path = require('path');
const { OAuth2Client } = require("google-auth-library");
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const errorHandler = require('./middlewares/errorHandler');



app.use(cors());
app.use(express.static('dist'));

app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errorHandler)




module.exports = app



