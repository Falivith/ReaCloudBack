/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDb();

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
