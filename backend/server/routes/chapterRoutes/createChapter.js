const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const chapterSchema = require('../../models/chapterModel')
const lessonSchema = require('../../models/LessonModel')


router.post('/create', async (req, res) => {
    if (Object.keys(req.body).length===1) {
        var { title, chapter_no, description, documentation_references} = req.body.params;
    }
    else {
        var { title, chapter_no, description, documentation_references} = req.body;
    }
    //const { title, chapter_no, description, documentation_references} = req.body;
    var test_id = null;
    var lessons = [];
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
    });
    //const lesson = await lessonSchema.find(lessonID)
    //console.log(lessons);
    //console.log("Gate 4");
    //creates the new lesson
    const createChapter = new chapterSchema({
        title: title,
        chapter_no: chapter_no,
        description: description,
        lessons: lessons,
        test_id: test_id,
        documentation_references: documentation_references
    });

    //console.log("Gate 5");
    try {
        //console.log(createChapter);
        const saveNewChapter = await createChapter.save();
        res.send(saveNewChapter);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new chapter" });
    }

})

module.exports = router;