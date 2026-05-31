const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const lessonSchema = require('../../models/LessonModel')

router.post("/:id/delete", async (req, res) => {
  var { id } = req.params;
    lessonSchema.deleteOne({_id: id}, function (err, lesson) {
      if (err) {
        console.log(err);
      }
      if (lesson["deletedCount"]<1) {
        res.status(404).send("LessonId did not exist.");
      } 
      else {
        //console.log(lesson);
        return res.json(lesson);
      }
    });
});

module.exports = router;
