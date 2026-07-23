const mongoose = require("mongoose");

//user schema/model
const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      min : 8
    },
    country: {
      required: false,
      type: String,
      default: "USA"
    },
    phoneNumber: {
      required: false,
      type: String,
      min: 12,
      max: 12,
      default: "###-###-####"
    },
    pronoun: {
      required: false,
      type: String,
      max: 15,
      default: "No Answer"
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)