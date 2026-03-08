const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/google', async (req, res) => {

  try {

    const { token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(token);

    const {
      uid,
      email,
      name,
      picture
    } = decodedToken;

    let user = await User.findOne({ googleId: uid });

    if (!user) {
      user = await User.create({
        googleId: uid,
        email,
        name,
        picture
      });
    }

    const apiToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: apiToken,
      user
    });

  } catch (error) {

    console.error("Error verifying token:", error);

    res.status(401).json({
      error: "Invalid token"
    });

  }

});

module.exports = router;