const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const submissionSchema = require('../../models/codeSubmissionModel')

router.post("/:id/delete", async (req, res) => {
  var { id } = req.params;
    submissionSchema.deleteOne({_id: id}, function (err, submission) {
      if (err) {
        console.log(err);
      }
      if (submission["deletedCount"]<1) {
        res.status(404).send("submissionId did not exist.");
      } 
      else {
        //console.log(submission);
        return res.json(submission);
      }
    });
});

module.exports = router;
