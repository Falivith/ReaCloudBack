const { OAuth2Client } = require("google-auth-library");
const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  checkToken,
  createJWT,
  verifyGoogleToken,
  findOrCreateUser,
} = require("../controllers/authentication.js");

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

authRouter.post("/", async (req, res) => {
  try {
    if (!req.body.code) {
      return res.status(400).json({ error: "Authorization code is required." });
    }

    const { tokens } = await oAuth2Client.getToken(req.body.code);

    if (!tokens || !tokens.id_token) {
      return res.status(400).json({ error: "Failed to obtain tokens." });
    }

    let payload = await verifyGoogleToken(tokens.id_token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid ID token." });
    }

    const jwtToken = await createJWT(payload);
    await findOrCreateUser(payload);

    return res.status(200).json({ jwt_token: jwtToken });
  } catch (error) {
    console.error("Error in auth route:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    }

    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
});

authRouter.post("/checkToken", async (req, res) => {
  try {
    const decoded = await checkToken(req);
    return res.status(200).json(decoded);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    } else {
      return res.status(401).json({ error: `${error}` });
    }
  }
});

module.exports = authRouter;
