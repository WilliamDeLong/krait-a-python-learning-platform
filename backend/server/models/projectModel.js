const mongoose = require("mongoose");

//user schema/model
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      label: "title",
    },
    instructions: {
      type: String,
      required: true,
      label: "instructions",
    },
    default_script: {
      type: String,
      required: true,
      label: "initial_script",
    },
    solution_verification: {
      type: String,
      required: true,
      label: "solver"
    },
    is_test: {
      type: Boolean,
      required: true,
      label: "is_test",
      default: false
    },
    documentation_id: {
      type: String,
      required: true,
      label: "documentation_id"
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "projects" }
);

module.exports = mongoose.model('projects', projectSchema)