const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const chapterSchema = require('../../models/chapterModel')
const lessonSchema = require('../../models/LessonModel')

router.post("/:id/refresh", async (req, res) =>
{
    //console.log("Gate 1");
    
    var { id } = req.params;
    //console.log(id);
    const chaptero = await chapterSchema.findById(id);
    //console.log(chaptero);
    var chapter_no = chaptero.chapter_no;
    var lessons = [];
    var test_id = null;
    //console.log("Gate 1");
    const query = lessonSchema.find();
    query.find({chapter_no: chapter_no});
    //console.log("Gate 2");
    query.getFilter();
    const lesson_acquisition = query.exec();
    //console.log("Gate 3");
    ((await lesson_acquisition).sort((a, b) => (a.order_within_chapter - b.order_within_chapter))).forEach(element => {
        lessons.push(element._id);
        if (element.is_test && test_id===null) {
            test_id =element._id;
        }
        //console.log(`${element._id} is lesson ${element.order_within_chapter}`);
    });
    // find and update lesson using stored information
    chapterSchema.findByIdAndUpdate(id, {
        lessons: lessons,
        test_id: test_id
    }, {new: true} ,function (err, chapter) {
    if (err){
        console.log(err);
    } else {
        // create and send new access token to local storage
        //console.log(chapter);
        res.send(chapter)
    }
    //const chaptero = chapterSchema.findById(id);
    //console.log(chaptero);
    });

})

module.exports = router;