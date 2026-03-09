const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, userController.getProfile);
router.post("/onboarding", verifyToken, userController.completeOnboarding);
router.patch("/profile", verifyToken, userController.updateProfile);

module.exports = router;