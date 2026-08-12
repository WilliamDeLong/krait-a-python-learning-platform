const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const chapterSchema = require('../../models/chapterModel')
const lessonSchema = require('../../models/LessonModel')

router.post("/:id/edit", async (req, res) =>
{
    //console.log("Gate 1");
    var { id } = req.params;
    if (Object.keys(req.body).length===1) {
        var { title, chapter_no, description, documentation_references} = req.body.params;
    }
    else {
        var { title, chapter_no, description, documentation_references} = req.body;
    }

    // check if lesson title is available
    const chapt = await chapterSchema.findOne({ title: title })
    //console.log("Gate 2");
    if (chapt) chapIdReg = JSON.stringify(id).replace(/["]+/g, '')
    if (chapt && chapIdReg !== id) return res.status(409).send({ message: "Chapter title is already in use, pick another" })
    //console.log("Gate 3");
    const chapterNumber = await chapterSchema.findOne({ chapter_no: chapter_no })
    if (chapterNumber)
        return res.status(409).send({ message: "A chapter with that as its listed order. Please select another." })
    //console.log("Gate 4");
    var lessons = [];
    var test_id;
    //console.log("Gate 1");
    const query = lessonSchema.find();
    query.find({chapter_no: chapter_no});
    //console.log("Gate 2");
    query.getFilter();
    const lesson_acquisition = query.exec();
    //console.log("Gate 3");
    (await lesson_acquisition).forEach(element => {
        lessons.push(element._id);
        if (element.is_test && test_id===null) {
            test_id =element._id;
        }
    });
    //console.log("Gate 5");
    // find and update lesson using stored information
    chapterSchema.findByIdAndUpdate(id, {
        title: title,
        chapter_no: chapter_no,
        description: description,
        lessons: lessons,
        test_id: test_id,
        documentation_references: documentation_references
    }, {new: true} ,function (err, chapter) {
    if (err){
        console.log(err);
    } else {
        // create and send new access token to local storage
        //console.log("Gate 5");
        res.send({ chapter: chapter })
    }
    });

})

module.exports = router;