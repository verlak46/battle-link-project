const mongoose = require("mongoose");

const WargameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    publisher: String,
    minPlayers: Number,
    maxPlayers: Number,
    year: Number
});

module.exports = mongoose.model("Wargame", WargameSchema);