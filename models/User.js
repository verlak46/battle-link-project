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
  favoriteGames: [String],
  experience: String,
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

module.exports = mongoose.model("User", UserSchema);
