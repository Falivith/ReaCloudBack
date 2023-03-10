const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
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
    

    const token = jwt.sign(userForToken, SECRET)
    response
        .status(200)
        .send({ token, nome: user.nome, email: user.email })
})

module.exports = loginRouter

