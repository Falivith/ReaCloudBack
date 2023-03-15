const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    console.log("jwt key not provided");
    return null
  }

module.exports = getTokenFrom