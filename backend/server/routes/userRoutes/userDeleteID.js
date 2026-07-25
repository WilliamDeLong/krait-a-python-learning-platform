const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const newUserModel = require('../../models/userModel')
const submissionSchema = require('../../models/codeSubmissionModel')

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
        //console.log(user);
        //console.log(id);
        submissionSchema.deleteMany({userID: id}, function (err, submission) {
            if (err) {
              console.log(err);
            }
            if (submission["deletedCount"]<1) {
              //console.log("No Submissions were deleted");
              user["submissions"] = ("User had no submissions");
            } 
            else {
              //console.log(submission);
              user["submissions"] = (submission);
            }
          });
          //console.log(user);
        return res.json(user);
      }
    });
});

module.exports = router;
