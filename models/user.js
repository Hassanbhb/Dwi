const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  from: String,
  when: String,
  title: String
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean
  },
  notifications: [notificationSchema],
  google: {
    id: String,
    token: String
  }
});

module.exports = mongoose.model("User", userSchema);
