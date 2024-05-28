const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { PORT } = require('./src/database/config');
const { connectToDatabase } = require('./src/database/db');
require('express-async-errors');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

const usersRouter = require('./src/routes/usersRouter');
const authRouter = require('./src/routes/googleAuthRouter');
const recursoRouter = require('./src/routes/recursoRouter');
const commentRouter = require('./src/routes/commentsRouter');

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/recurso', recursoRouter);
app.use('/api/comments', commentRouter);

// const loginRouter = require('./src/routes/loginRouter'); // TODO: Rota morta
// Rota morta app.use('/api/login', loginRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const errorHandler = require('./src/controllers/errorHandler');

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port <${PORT}>`);
  });
};

start();

module.exports = app;
