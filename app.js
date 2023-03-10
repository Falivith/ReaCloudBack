const express = require('express');
const app = express();
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./controllers/users');


app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use('/api/users', usersRouter);


module.exports = app



