const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');

// todas as funções de autenticação ficarão nesse arquivo
//
// ideia: para logar o user usa-se o verifyGoogleToken(), essa função retorna um payload com dados do usuário
// usamos esses dados para criar o token de sessão JWT com a função createJWT()
// depois que esse token JWT for criado, ele é passado no request
// e toda vez que precisar verificar o usuário com ele, utiliza o checkToken()

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
  
  //const userid = payload['sub']; // sub é o unique identifier do user
  // exemplo de payload
  // {
  //   "sub": "1234567890",
  //   "name": "John Doe",
  //   "email": "johndoe@example.com",
  //   "picture": "https://example.com/profile.jpg", //The URL of the user's profile picture.
  //   "iat": 1516239022, //Issued at time (timestamp).
  //   "exp": 1516242622, //Expiration time (timestamp).
  //   "aud": "your-client-id.apps.googleusercontent.com", //Audience (your client ID).
  //   "iss": "accounts.google.com", //Issuer (who issued the token, e.g., accounts.google.com).
  //   "email_verified": true
  // }
}

async function createJWT(payload) {
  const user = {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });
  return token;
}


async function checkToken(request,response) {
  try {
    const token = request.headers.authorization?.split(' ')[1]; // extracts the token from the Authorization header if it is present and properly formatted as a Bearer token
    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
          return response.status(401).json({ error: 'Token expired' });
          }
    return response.status(401).json({ error: `${err}` });
  }
}

module.exports = {
  verifyGoogleToken,
  createJWT,
  checkToken
};



// ABAIXO: CÓDIGO ANTIGO
// const checkToken = async (request,response) =>{
//   const jwt = require('jsonwebtoken')
  
//   try{
//   const decodedToken = await jwt.verify(getTokenFrom(request), process.env.SECRET)
//   if (!decodedToken) {
//     return response.status(401).json({ error: 'token invalid' })
//   }
//   return decodedToken
//   }
//   catch (err) {
//     if (err instanceof jwt.TokenExpiredError) {
//       return response.status(401).json({ error: 'Token expired' });
//     }
//   }
// }

// module.exports = {checkToken}

