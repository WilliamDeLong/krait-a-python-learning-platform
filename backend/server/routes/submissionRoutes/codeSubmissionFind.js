const express = require("express");
const router = express.Router({ mergeParams: true });
const z = require("zod");
const bcrypt = require("bcrypt");

const submissionSchema = require('../../models/codeSubmissionModel')

router.get("/findSubmission", (req, res, next) => {
  //console.log("Check 1");
  const query = submissionSchema.find();
  var { userID, lessonID, script_submission, success} = req.query;
  if (Object.keys(req.query).length===0) return next('route');
  if (userID != null) {
    query.find({userID: userID});
  }
  if (lessonID != null) {
    query.find({lessonID: lessonID});
  }
  if (script_submission != null) {
    query.find({script_submission: { "$regex": script_submission}});
  }
  if (success != null) {
    query.find({success: success});
  }
  query.getFilter();
  
  query.exec(function (err, less) {
    if (err) {
      console.log(err);
    }
    if (less.length==0) {
      res.status(404).send(`A Submission matching the parameters could not be found.`);
    } 
    else {
      return res.json(less);
    }
  });

  
})

router.get("/findSubmission", async (req, res) => {
  //console.log("Check 2");
  const query = submissionSchema.find();
  var { userID, lessonID, script_submission, success} = req.body;
  if (userID != null) {
    query.find({userID: userID});
  }
  if (lessonID != null) {
    query.find({lessonID: lessonID});
  }
  if (script_submission != null) {
    query.find({script_submission: { "$regex": script_submission}});
  }
  if (success != null) {
    query.find({success: success});
  }
  
  query.getFilter();
  
  query.exec(function (err, less) {
    if (err) {
      console.log(err);
    }
    if (less.length==0) {
      res.status(404).send(`A Submission matching the parameters could not be found.`);
    } 
    else {
      return res.json(less);
    }
  });
});



module.exports = router;