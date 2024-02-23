const express = require('express');
const app = express();
const path = require('path');
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./routes/usersRouter');
const loginRouter = require('./routes/loginRouter');
const errorHandler = require('./middlewares/errorHandler');
const authRouter = require('./routes/googleAuthRouter');
const recursoRouter = require('./routes/recursoRouter');
const commentRouter = require('./routes/commentsRouter');

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
