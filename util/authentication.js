
const getTokenFrom = request => {
  const authorization = request.get('authorization') || request.body.headers.Authorization;
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    console.log("jwt key not provided");
    return null
  }

const checkToken = async request =>{
  const jwt = require('jsonwebtoken')
  const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken) {
      return response.status(401).json({ error: 'token invalid' })
    }
   
    return decodedToken
}



module.exports = {getTokenFrom,checkToken}