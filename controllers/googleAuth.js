const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const authRouter = require('express').Router()
const jwt = require("jsonwebtoken");
const User = require("../models/user");




async function verifyGoogleToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
      return { payload: ticket.getPayload() };
    } catch (error) {
      return { error: "Invalid user detected. Please try again" };
    }
  }


  authRouter.post("/googleLogin", async (req, res) => {
    
 


    try {
      // console.log({ verified: verifyGoogleToken(req.body.credential) });
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
  
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
        const profile = verificationResponse?.payload;
        
        const [user, created] = await User.findOrCreate({
          where: { email: profile.email },
          defaults: {
            nome: profile.given_name,
            sobrenome: profile.family_name,
          }
        });

        console.log('created = ', created);

        
        res.status(201).json({
          message: "Signup was successful",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token:  jwt.sign({ email: profile?.email }, process.env.SECRET, {
              expiresIn: "1d",
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occured. Registration failed.",
      });
    }
  });



  module.exports = authRouter