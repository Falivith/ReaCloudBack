const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../util/config')
const getTokenFrom = require('../util/authentication')


loginRouter.post('/checkToken', async(req, res) => {
  
  
  const decodedToken = await jwt.verify(getTokenFrom(req), process.env.SECRET)

  if (!decodedToken) {
      return res.status(401).json(false)
    }
    else{
      res.status(200).json(true);
    }
});



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


module.exports = loginRouter

