const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  bgColor: String,
  moods: [{
    name: String,
    emoji: String,
  }],
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
