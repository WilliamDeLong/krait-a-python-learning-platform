const mongoose = require("mongoose");

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
      required: true,
      label: "description",
    },
    lessons: {
      type: [LessonSchema],
      required: true,
      label: "lessons_belonging_to_chapter"
    },
    test_id: {
      type: ObjectId,
      required: true,
      label: "test_id"
    },
    documentation_references: {
      type: String,
      required: true,
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