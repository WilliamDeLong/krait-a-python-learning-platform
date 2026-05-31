const express = require("express");
const router = express.Router();
const submissionSchema = require('../../models/codeSubmissionModel')

router.get('/getAll', async (req, res) => {
    const submission = await submissionSchema.find();
    return res.json(submission)
  })

  module.exports = router;