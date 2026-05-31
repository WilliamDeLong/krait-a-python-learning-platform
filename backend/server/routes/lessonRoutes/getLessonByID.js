const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const lessonSchema = require('../../models/LessonModel')

router.get("/:id", async (req, res) => {
  var { id } = req.params;
  //console.log(id);

  lessonSchema.findById(id, function (err, lesson) {
    if (err) {
      console.log(err);
    }
    if (lesson==null) {
      res.status(404).send("lessonId does not exist.");
    } 
    else {
      return res.json(lesson);
    }
  });
});

module.exports = router;
