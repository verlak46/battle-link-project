const express = require("express");
const router = express.Router();
const Wargame = require("../models/Wargame");

// GET /wargames
router.get("/", async (req, res) => {
  try {
    const wargames = await Wargame.find();

    res.json(wargames);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo wargames",
    });
  }
});

module.exports = router;
