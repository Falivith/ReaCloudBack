const express = require('express');
const app = express();
const path = require('path');
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const errorHandler = require('./middlewares/errorHandler');
const authRouter = require('./controllers/googleAuth');
const recursoRouter = require('./controllers/reaHandler');
const commentRouter = require('./controllers/commentsHandler');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
 
app.use('/api/users', usersRouter);  
app.use('/api/login', loginRouter);
app.use('/api', authRouter);
app.use('/api/recurso', recursoRouter);
app.use('/api/comment', commentRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errorHandler)

module.exports = app
