const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

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
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '72h' });
  return token;
}

async function checkToken(request) {
  const token = request.headers.authorization?.split(' ')[1]; 

  if (!token) {
    throw new Error('Token missing');
  }

  jwt.verify(token, process.env.JWT_SECRET)
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function findOrCreateUser(payload) {
  try {
    const [user, created] = await User.findOrCreate({
      where: { id: payload.sub },
      defaults: {
        given_name: payload.given_name,
        family_name: payload.family_name,
        email: payload.email,
        institution: await getInstitutionFromHd(payload.hd),
        profilePicture: payload.picture,
      },
    });

    if (created) {
      console.log('New user created:', user);
    } else {
      console.log('User already exists:', user);
    }

    return user;
  } catch (error) {
    console.error('Error in findOrCreateUser:', error);
    throw error;
  }
}

// TODO: Pegar sufixos UFSM FURG UFRGS
async function getInstitutionFromHd(suffix) {
  const emailToInstitutionMap = new Map();
  const emailInstitutionPairs = [
    ['inf.ufpel.edu.br', 'UFPEL'],
    ['usp.br', 'USP'],
    ['unicamp.br', 'UNICAMP'],
    ['ufrj.br', 'UFRJ'],
    ['ufrgs.br', 'UFRGS']
  ];

  emailInstitutionPairs.forEach(([suffix, institution]) => {
    emailToInstitutionMap.set(suffix, institution);
  });

  return emailToInstitutionMap.get(suffix) || null;
}

module.exports = {
  verifyGoogleToken,
  createJWT,
  checkToken,
  findOrCreateUser
};
