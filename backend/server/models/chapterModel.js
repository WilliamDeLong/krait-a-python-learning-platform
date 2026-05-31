const mongoose = require("mongoose");
const LessonSchema = require('./LessonModel')

//user schema/model
const ChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      label: "title",
    },
    chapter_no: {
      type: Number,
      required: true,
      label: "chapter"
    },
    description: {
      type: String,
      label: "description",
    },
    lessons: {
      type: [mongoose.ObjectId],
      label: "lessons_belonging_to_chapter"
    },
    test_id: {
      type: mongoose.ObjectId,
      label: "test_id"
    },
    documentation_references: {
      type: String,
      label: "references_to_documentation"
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "chapters" }
);

module.exports = mongoose.model('chapters', ChapterSchema)