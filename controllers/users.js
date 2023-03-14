const bcrypt = require('bcryptjs');
const User = require('../models/user');
const usersRouter = require('express').Router()

usersRouter.get('/', async (req, res) => {
    const user = await User.findAll();
    res.status(201).json(user);
  });


  usersRouter.post('/', async (req, res) => {
    
    const saltRounds = 10
    console.log('req.body = ', req.body);
    
    console.log('password = ', req.body?.values?.password);
    const passwordHashed = await bcrypt.hash(req.body?.values?.password,saltRounds)

    
    const user = await User.create({...req.body.values, password:passwordHashed })

    res.status(201).json(user)
  })


module.exports = usersRouter