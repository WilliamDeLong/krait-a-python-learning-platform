const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const newUserModel = require("../models/userModel");

router.post("/:id/delete", async (req, res) => {
  var { id } = req.params;
    newUserModel.deleteOne({_id: id}, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (user["deletedCount"]<1) {
        res.status(404).send("userId did not exist.");
      } 
      else {
        console.log(user);
        return res.json(user);
      }
    });
});

module.exports = router;
