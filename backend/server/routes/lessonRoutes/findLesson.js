const express = require("express");
const router = express.Router({ mergeParams: true });
const z = require("zod");
const bcrypt = require("bcrypt");

const lessonSchema = require('../../models/LessonModel')
const status = {0: "Unused", 1: "Used"}
const paramater_status = {"title": 0, "instructions": 0, "default_script": 0, "solution_verification": 0, "is_test": 0, "chapter_no": 0, "order_within_chapter": 0, "documentation_id": 0}

router.get("/findLesson", (req, res, next) => {
  //console.log("Check 1");
  const query = lessonSchema.find();
  var { title, instructions, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id} = req.query;
  if (Object.keys(req.query).length===0) return next('route');
  if (title != null) {
    query.find({title: { "$regex": title}});
    paramater_status["title"]=1;
  }
  if (instructions != null) {
    query.find({instructions: { "$regex": instructions}});
    paramater_status["instructions"]=1;
  }
  if (default_script != null) {
    query.find({default_script: { "$regex": default_script}});
    paramater_status["default_script"]=1
  }
  if (solution_verification != null) {
    query.find({solution_verification: { "$regex": solution_verification}});
    paramater_status["solution_verification"]=1;
  }
  if (is_test != null) {
    query.find({is_test: is_test});
    paramater_status["is_test"]=1;
  }
  if (chapter_no != null) {
    query.find({chapter_no: chapter_no});
    paramater_status["chapter_no"]=1;
  }
  if (order_within_chapter != null) {
    //console.log(order_within_chapter);
    query.find({order_within_chapter: order_within_chapter});
    paramater_status["order_within_chapter"]=1;
  }
  if (documentation_id != null) {
    query.find({documentation_id: { "$regex": documentation_id}});
    paramater_status["documentation_id"]=1;
  }
  
  query.getFilter();
  
  query.exec(function (err, less) {
    if (err) {
      console.log(err);
    }
    if (less.length==0) {
      res.status(404).send(`A Lesson matching the parameters could not be found.`);
    } 
    else {
      return res.json(less);
    }
  });

  
})

router.get("/findLesson", async (req, res) => {
  //console.log("Check 2");
  const paramater_status = {"title": 0, "instructions": 0, "default_script": 0, "solution_verification": 0, "is_test": 0, "chapter_no": 0, "order_within_chapter": 0, "documentation_id": 0}
  const query = lessonSchema.find();
  var { title, instructions, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id} = req.body;
  if (title != null) {
    query.find({title: { "$regex": title}});
    paramater_status["title"]=1;
  }
  if (instructions != null) {
    query.find({instructions: { "$regex": instructions}});
    paramater_status["instructions"]=1;
  }
  if (default_script != null) {
    query.find({default_script: { "$regex": default_script}});
    paramater_status["default_script"]=1
  }
  if (solution_verification != null) {
    query.find({solution_verification: { "$regex": solution_verification}});
    paramater_status["solution_verification"]=1;
  }
  if (is_test != null) {
    query.find({is_test: is_test});
    paramater_status["is_test"]=1;
  }
  if (chapter_no != null) {
    query.find({chapter_no: chapter_no});
    paramater_status["chapter_no"]=1;
  }
  if (order_within_chapter != null) {
    query.find({order_within_chapter: order_within_chapter});
    paramater_status["order_within_chapter"]=1;
  }
  if (documentation_id != null) {
    query.find({documentation_id: { "$regex": documentation_id}});
    paramater_status["documentation_id"]=1;
  }
  
  query.getFilter();
  
  query.exec(function (err, less) {
    if (err) {
      console.log(err);
    }
    if (less.length==0) {
      //\nParameters that were in use:\ntitle: ${parameter_status["title"]}, \ninstructions: ${parameter_status["instructions"]}, \ndefault_script: ${parameter_status["default_script"]}, \nsolution_verification: ${parameter_status["solution_verification"]}, \nis_test: ${parameter_status["is_test"]}, \nchapter_no: ${parameter_status["chapter_no"]}, \norder_within_chapter: ${parameter_status["order_within_chapter"]}, \ndocumentation_id: ${parameter_status["documentation_id"]}
      res.status(404).send(`A Lesson matching the parameters could not be found.`);
    } 
    else {
      return res.json(less);
    }
  });
});



module.exports = router;