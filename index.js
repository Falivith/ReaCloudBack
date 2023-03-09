const express = require('express');
const app = express();
const cors = require('cors');
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db');
const usersRouter = require('./controllers/users');


// app.use(cors());
// app.use(express.static('dist'));
app.use(express.json());
app.use('/api/users', usersRouter);

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

module.export = {app};
