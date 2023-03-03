/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.static('dist'));

app.use(express.json());


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
