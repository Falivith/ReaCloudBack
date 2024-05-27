const { OAuth2Client } = require("google-auth-library");
const authRouter = require('express').Router()
const jwt = require("jsonwebtoken");
const User = require('../models/user.js')
const axios = require('axios');
const { checkToken, createJWT, verifyGoogleToken, findOrCreateUser } = require("../controllers/authentication.js");

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

authRouter.post("/", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);
  let payload = await verifyGoogleToken(tokens.id_token);
  let jwt = await createJWT(payload);
  findOrCreateUser(payload);
  res.status(200).json({ jwt_token: jwt });
});

authRouter.post("/checkToken", async (req, res) => {
  try {
    const decoded = await checkToken(req);
    res.status(200).json(decoded);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expired' });
    } else {
      res.status(401).json({ error: `${error}` });
    }
  }
});

  module.exports = authRouter
