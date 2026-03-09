const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      favoriteGames,
      experienceLevel,
      location,
    } = req.body;

    const update = {
      onboardingCompleted: true,
    };

    if (favoriteGames !== undefined) {
      update.favoriteGames = favoriteGames;
    }

    if (experienceLevel !== undefined) {
      update.experienceLevel = experienceLevel;
    }

    if (location !== undefined) {
      update.location = location;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      favoriteGames,
      experienceLevel,
      location,
      name,
      picture,
    } = req.body;

    const update = {};

    if (favoriteGames !== undefined) {
      update.favoriteGames = favoriteGames;
    }

    if (experienceLevel !== undefined) {
      update.experienceLevel = experienceLevel;
    }

    if (location !== undefined) {
      update.location = location;
    }

    if (name !== undefined) {
      update.name = name;
    }

    if (picture !== undefined) {
      update.picture = picture;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};