const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
//user schema/model
const newDocumentationSchema = new mongoose.Schema(
  {
    shortID: {
      type: Number,
      required: true,
      label: "identification",
      default: 0
    },
    title: {
      type: String,
      required: true,
      label: "title",
    },
    description: {
      type: String,
      required: true,
      label: "description",
    },
    content: {
      type: String,
      required: true,
      label: "content",
    },
    author: {
      type: mongoose.ObjectId,
      label: "author",
    },
    reference_list: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "documentation" }
);

module.exports = mongoose.model('documentation', newDocumentationSchema)