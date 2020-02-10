const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const postSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  createdAt: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Post", postSchema);
