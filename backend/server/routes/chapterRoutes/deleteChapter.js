const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const chapterSchema = require('../../models/chapterModel')

router.post("/:id/delete", async (req, res) => {
  var { id } = req.params;
    chapterSchema.deleteOne({_id: id}, function (err, chapter) {
      if (err) {
        console.log(err);
      }
      if (chapter["deletedCount"]<1) {
        res.status(404).send("chapterId did not exist.");
      } 
      else {
        //console.log(chapter);
        return res.json(chapter);
      }
    });
});

module.exports = router;
