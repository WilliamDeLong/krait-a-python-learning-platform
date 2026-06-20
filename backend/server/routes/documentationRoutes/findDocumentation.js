const express = require("express");
const router = express.Router({ mergeParams: true });
const z = require("zod");
const bcrypt = require("bcrypt");

const documentationSchema = require("../../models/documentationModel");


router.get("/find", async (req, res, next) => {
  const query = documentationSchema.find();
  var { shortID, title, description, content, author} = req.query;
  if (Object.keys(req.query).length===0) return next('route');
  if (title != null) {
    query.find({title: { "$regex": title}});
  }
  if (description != null) {
    query.find({description: { "$regex": description}});
  }
  if (content != null) {
    query.find({content: { "$regex": content}});
  }
  if (shortID != null) {
    query.find({shortID: shortID});
  }
  
  if (author != null) {
    query.find({author: author});
  }
  query.getFilter();
  
  query.exec(function (err, ques) {
    if (err) {
      console.log(err);
    }
    if (ques.length==0) {
      res.status(404).send("A Question matching the parameters could not be found.");
    } 
    else {
      return res.json(ques);
    }
  });
});

router.get("/find", async (req, res) => {
  const query = documentationSchema.find();
  var { title, description, content, author} = req.body;
  if (title != null) {
    query.find({title: { "$regex": title}});
  }
  if (description != null) {
    query.find({description: { "$regex": description}});
  }
  if (content != null) {
    query.find({content: { "$regex": content}});
  }
  
  if (author != null) {
    query.find({author: author});
  }
  query.getFilter();
  
  query.exec(function (err, ques) {
    if (err) {
      console.log(err);
    }
    if (ques.length==0) {
      res.status(404).send("A Question matching the parameters could not be found.");
    } 
    else {
      return res.json(ques);
    }
  });
});



module.exports = router;