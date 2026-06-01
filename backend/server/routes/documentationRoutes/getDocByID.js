const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const documentationSchema = require('../../models/documentationModel')

router.get("/:id", async (req, res) => {
  var { id } = req.params;
  //console.log(id);

  documentationSchema.findById(id, function (err, documentation) {
    if (err) {
      console.log(err);
    }
    if (documentation==null) {
      res.status(404).send("documentationId does not exist.");
    } 
    else {
      return res.json(documentation);
    }
  });
});

module.exports = router;
