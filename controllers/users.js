/* eslint-disable */
const User = require('./models/user');
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    const user = await User.findAll();
    res.json(user);
  });

  app.post('/', async (req, res) => {
    console.log(req.body)
    const User = await User.create(req.body)
    res.json(User)
  })

module.exports = usersRouter