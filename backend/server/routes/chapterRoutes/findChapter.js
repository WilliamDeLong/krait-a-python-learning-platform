const express = require("express");
const router = express.Router({ mergeParams: true });
const z = require("zod");
const bcrypt = require("bcrypt");

const chapterSchema = require('../../models/chapterModel')

router.get("/findChapter", (req, res, next) => {
  //console.log("Check 1");
  const query = chapterSchema.find();
  var { title, chapter_no, description, test_id} = req.query;
  if (Object.keys(req.query).length===0) return next('route');
  if (title != null) {
    query.find({description: { "$regex": description}});
  }
  if (chapter_no != null) {
    query.find({chapter_no: chapter_no});
  }
  if (description != null) {
    query.find({description: { "$regex": description}});
  }
  if (test_id != null) {
    query.find({test_id: test_id});
  }
  query.getFilter();
  
  query.exec(function (err, chap) {
    if (err) {
      console.log(err);
    }
    if (chap.length==0) {
      res.status(404).send(`A Chapter matching the parameters could not be found.`);
    } 
    else {
      return res.json(chap);
    }
  });

  
})

router.get("/findChapter", async (req, res) => {
  //console.log("Check 2");
  const query = chapterSchema.find();
  var { title, chapter_no, description, test_id} = req.body;
  if (title != null) {
    //console.log(typeof title);
    query.find({description: { "$regex": title}});
  }
  if (chapter_no != null) {
    query.find({chapter_no: chapter_no});
  }
  if (description != null) {
    query.find({description: { "$regex": description}});
  }
  if (test_id != null) {
    query.find({test_id: test_id});
  }
  //console.log("Check 3");
  query.getFilter();
  //console.log("Check 4");
  query.exec(function (err, chap) {
    if (err) {
      console.log(err);
    }
    if (chap.length==0) {
      //console.log("Check 5: 1");
      res.status(404).send(`A Chapter matching the parameters could not be found.`);
    } 
    else {
      //console.log("Check 5: 2");
      return res.json(chap);
    }
  });
});



module.exports = router;