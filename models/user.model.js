const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phone: {
    type: Number,
  },
  skills: {
    type: Array,
  },
  image_string: {
    type: Array,
  }
});

module.exports = mongoose.model("User", UserSchema);
