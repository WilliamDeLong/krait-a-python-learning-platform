const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const chapterSchema = require('../../models/chapterModel')

router.get("/find/:id", async (req, res) =>
{
    //console.log("Gate 1");
    
    var { id } = req.params;
    //console.log(id);
    //console.log(chaptero);
    // find and update lesson using stored information
    chapterSchema.findById(id, function (err, chapter) {
        //console.log("Gate 3");
        if (err) {
        //console.log(err);
        }
        if (chapter==null) {
        res.status(404).send("chapterId does not exist.");
        } 
        else {
        return res.json(chapter);
        }
    });

})

module.exports = router;