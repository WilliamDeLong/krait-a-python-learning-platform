const mongoose = require("mongoose");

//user schema/model
const lessonSchema = new mongoose.Schema(
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
    chapter_no: {
      type: Number,
      required: true,
      label: "chapter"
    },
    order_within_chapter: {
      type: Number,
      required: true,
      label: "lesson_number"
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
  { collection: "lessons" }
);

module.exports = mongoose.model('lessons', lessonSchema)