/* eslint-disable */
const User = require('../models/user');
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    const user = await User.findAll();
    res.status(201).json(user);
  });


  usersRouter.post('/', async (req, res) => {
    try {
      console.log(req.body)
      const user = await User.create(req.body)
      res.json(user)
    } 
    catch(error) {
      return res.status(400).json({ error })
    }
  })

module.exports = usersRouter