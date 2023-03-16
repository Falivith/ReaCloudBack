const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../util/config')

loginRouter.post('/', async(request,response)=> {

    const {email,password} = request.body

    const user = await User.findOne({where: {email}})

    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }

    const userForToken = {
    username: user.email,
    id: user.id,
    }  

  const HoursUntilExpire = 5;

  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60*HoursUntilExpire }
  )
    


    response
        .status(200)
        .send({ token, nome: user.nome, email: user.email })
})


loginRouter.post('/googleAuth', async (req, res) => {
    
  console.log('req.body googleAuth = ', req.body);
  const info = jwt_decode(req.body)
  const email = info.body.email

  const user = await User.findOne({ where: { email } });
  if (user) {
    res.status(200).json(user)
  } else {
    const user = await User.create(req.body)
    res.status(201).send(user.toJSON())
  }
})



module.exports = loginRouter

