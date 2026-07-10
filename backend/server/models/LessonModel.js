const mongoose = require("mongoose");

//user schema/model
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      label: "title",
      default: "Placeholder title."
    },
    instructions: {
      type: String,
      required: true,
      label: "instructions",
      default: "You know how to make a print statement, right? Make one."
    },
    default_script: {
      type: String,
      required: true,
      label: "initial_script",
      default: "#This is where you put YOUR code to be ran."
    },
    solution_verification: {
      type: Object,
      required: true,
      label: "solver",
      default: {"funcName": "functionZero","testCases": [{ "args": [5], "expected": 5 },{ "args": [201], "expected": 201 },{ "args": [74], "expected": 74 }]}
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
      label: "chapter",
      default: 0
    },
    order_within_chapter: {
      type: Number,
      required: true,
      label: "lesson_number",
      default: 0
    },
    documentation_id: {
      type: String,
      label: "documentation_id"
    },
    description: {
      type: String,
      label: "description"
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "lessons" }
);

module.exports = mongoose.model('lessons', lessonSchema)