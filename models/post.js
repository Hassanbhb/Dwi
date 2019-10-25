const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Post", postSchema);
