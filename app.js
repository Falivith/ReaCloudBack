const express = require('express');
const app = express();
const path = require('path');
require('express-async-errors')

const cors = require('cors');
const usersRouter = require('./src/routes/usersRouter');
const loginRouter = require('./src/routes/loginRouter');
const errorHandler = require('./src/controllers/errorHandler');
const authRouter = require('./src/routes/googleAuthRouter');
const recursoRouter = require('./src/routes/recursoRouter');
const commentRouter = require('./src/routes/commentsRouter');
const { PORT } = require('./src/database/config');
const { connectToDatabase } = require('./src/database/db');

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

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

module.exports = app;
