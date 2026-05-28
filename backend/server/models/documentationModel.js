const mongoose = require("mongoose");

//user schema/model
const newDocumentationSchema = new mongoose.Schema(
  {
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