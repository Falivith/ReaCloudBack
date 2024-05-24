const checkToken = async (request,response) =>{
  const jwt = require('jsonwebtoken')
  
  try{
  const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }
  return decodedToken
  }
  catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return response.status(401).json({ error: 'Token expired' });
    }
  }
}

module.exports = {checkToken}
