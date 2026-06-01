const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const documentationSchema = require('../../models/documentationModel')

router.post("/:id/delete", async (req, res) => {
  var { id } = req.params;
    documentationSchema.deleteOne({_id: id}, function (err, documentation) {
      if (err) {
        console.log(err);
      }
      if (documentation["deletedCount"]<1) {
        res.status(404).send("documentationId did not exist.");
      } 
      else {
        //console.log(documentation);
        return res.json(documentation);
      }
    });
});

module.exports = router;
