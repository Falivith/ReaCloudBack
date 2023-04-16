const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const getTokenFrom = require('../util/authentication');
const usersRouter = require('express').Router()
const multer = require('multer');
const fs = require('fs');


// set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })

usersRouter.post('/uploadPhoto',upload.single('file'),async (request, response) => {
    
  const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  console.log('request.file = ', request.file);
  const imageFile = fs.readFileSync(request.file.path); // read uploaded file from temporary directory
  const buffer = Buffer.from(imageFile); // convert file data to buffer
  console.log('decodedToken', decodedToken);

  const user = await User.findOne({ where: { email: decodedToken.email } });
if (user) {
  const updatedUser = await user.update({
    profilePicture: buffer
  }, { returning: true });

  fs.unlink(request.file.path, (err) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: 'Error deleting file' });
    }

    response.status(200).json(updatedUser);
  });
} else {
  console.log('User not found');
  return response.status(404).json({ error: 'User not found' });
} 
})



usersRouter.get('/uploadPhoto', async (request, response) => {
    
    const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findOne({ where: { email: decodedToken.email } });
    
    
    if (user.profilePicture) {
      response.set('Content-Disposition', 'inline');
      response.json({data: user.profilePicture})

    } else {
      console.log('picture not found');
      return response.status(200);
    } 
})





usersRouter.get('/', async (req, res) => {
    const user = await User.findAll();
    res.status(201).json(user);
  });


  usersRouter.post('/', async (req, res) => {
    
    const saltRounds = 10
    console.log('req.body = ', req.body);
    
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const passwordHashed = await bcrypt.hash(req.body.password,saltRounds)
    const user = await User.create({...req.body, password:passwordHashed })
    res.status(201).json(user)
  })

  usersRouter.get('/:email', async (request, response) => {
    
    const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
    
    const email = request.params.email;
    const user = await User.findOne({ where: { email } });
    if (user) {
      response.status(200).json(user)
    } else {
      console.log('User not found1');
      return response.status(404).json({ error: 'User not found' });
    } 
})
  

usersRouter.put('/:email', async (request, response) => {

  const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const email = request.params.email;
  const user = await User.findOne({ where: { email } });
  if (user) {

    console.log('request.body = ', request.body);
    const {profilePicture,...data} = request.body
    
    const updatedUser = await user.update(data);
    response.status(200).json(updatedUser)

  } else {
    console.log('User not found');
    return response.status(404).json({ error: 'User not found' });
  } 
})

module.exports = usersRouter