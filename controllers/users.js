const bcrypt = require('bcryptjs');
const User = require('../models/user');
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    const user = await User.findAll();
    res.status(201).json(user);
  });


  usersRouter.post('/', async (req, res) => {
    
    const {password} = req.body
    
    const saltRounds = 10
    const passwordHashed = await bcrypt.hash(password,saltRounds)

    const userObject = {...req.body, password : passwordHashed}

    const user = await User.create(userObject)
    res.status(201).json(user)
  })


module.exports = usersRouter