const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  createdBy: {
    type: Object,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Object,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
 
});

module.exports = mongoose.model("Blog", BlogSchema);
