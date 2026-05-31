const express = require("express");
const router = express.Router();
const chapterSchema = require('../../models/chapterModel')

router.get('/list', async (req, res) => {
    const chapters = await chapterSchema.find();
    return res.json(chapters)
  })

  module.exports = router;