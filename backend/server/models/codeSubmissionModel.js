import { ObjectId } from "bson";

const mongoose = require("mongoose");

//user schema/model
const userSubmissionSchema = new mongoose.Schema(
  {
    userID: {
      type: ObjectId,
      required: true,
      label: "userID",
    },
    lessonID: {
      type: ObjectId,
      required: true,
      label: "lesson ID",
    },
    script_submission: {
      type: String,
      required: true,
      label: "submitted script",
    },
    success: {
      required: true,
      type: Boolean,
      default: false
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    submission_date: {
      type: Date,
      default: null,
    },
  },
  { collection: "codeSubmissions" }
);

module.exports = mongoose.model('codeSubmissions', userSubmissionSchema)