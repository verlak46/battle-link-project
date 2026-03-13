const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  name: String,
  picture: String,
  // Guarda el campo `id` (string) del modelo Wargame, por ejemplo "warhammer40k"
  favoriteGames: [String],
  experienceLevel: {
    type: String,
    enum: ["beginner", "casual", "competitive"]
  },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number]
    }
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
}, { timestamps: true });

UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", UserSchema);
