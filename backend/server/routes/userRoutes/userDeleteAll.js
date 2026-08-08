const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel')

router.post('/deleteAll', async (req, res) => {
    res.status(404).send("Command has been depreciated.");
    //const user = await newUserModel.deleteMany();
    //return res.json(user)
  })

  module.exports = router;