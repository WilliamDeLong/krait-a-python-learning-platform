const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const lessonSchema = require('../../models/LessonModel')

router.post('/create', async (req, res) => {
    const { title, instructions, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id } = req.body

    //check if a lesson with the same title already exists
    const lesson_title = await lessonSchema.findOne({ title: title })
    if (lesson_title)
        return res.status(409).send({ message: "There is already a lesson with that title, please select another." })
    const lesson_order_within_chapter = await lessonSchema.findOne({chapter_no: chapter_no, order_within_chapter: order_within_chapter})
    if (lesson_order_within_chapter)
        return res.status(409).send({ message: "There's a pre-existing lesson with that order value in the same chapter, please select another." })

    //generates the hash
    
    //parse the generated hash into the password
    
    //creates a new user
    const createLesson = new lessonSchema({
        title: title,
        instructions: instructions,
        default_script: default_script,
        solution_verification: solution_verification,
        is_test: is_test,
        chapter_no: chapter_no,
        order_within_chapter: order_within_chapter,
        documentation_id: documentation_id
    });

   
    try {
        const saveNewLesson = await createLesson.save();
        res.send(saveNewLesson);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new lesson" });
    }

})

module.exports = router;