const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  owner: String,
  day: Number,
  month: Number,
  year: Number,
  text: String,
  moods: [{
    name: String,
    emoji: String,
    category: String,
  }]
});

// compile model from schema
module.exports = mongoose.model("journal", JournalSchema);
