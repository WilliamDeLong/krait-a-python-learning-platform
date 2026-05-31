const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const submissionSchema = require('../../models/codeSubmissionModel')

router.get("/load/:id", async (req, res) => {
  var { id } = req.params;
  //console.log(id);

  submissionSchema.findById(id, function (err, submission) {
    if (err) {
      console.log(err);
    }
    if (submission==null) {
      res.status(404).send("submissionId does not exist.");
    } 
    else {
      return res.json(submission);
    }
  });
});

module.exports = router;
