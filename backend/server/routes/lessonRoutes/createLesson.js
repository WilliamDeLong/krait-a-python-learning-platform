const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const lessonSchema = require('../../models/LessonModel')
const data_default = { title: "Placeholder title.", instructions: "You know how to make a print statement, right? Make one.", instructionsHTML: "<div class='FormattedTextSection'>You know how to make a print statement, right? Make one.</div>", default_script: "#This is where you put YOUR code to be ran.", solution_verification: "print('Hello World')", is_test: false, chapter_no: 0, order_within_chapter: 0};

router.post('/create', async (req, res) => {
    const data_2_check = req.body
    //console.log(data_2_check);

    // I need all of the elements in an object so I can iterate through them
    //const lessonData = lessonSchema.findById(id); 
    //console.log((lessonData));
    //Due to lessons having default values, we need to set empty values to their defaults so that the system can check for duplicates accurately.
    /* Object.keys(data_default).forEach(element => {
        if (data_2_check[element] === undefined) 
            data_2_check[element] = data_default[element];
        //console.log(`Testing ${element}:\n\tDefault Value: ${data_default[element]}\n\tInputted Value: ${data_2_check[element]}\n\tComparison: ${data_default[element]===data_2_check[element]}`)
    }); */
    //console.log("Gate 2");
    // After we have our defaulted sets, we can now properly set them to their individual variables and check each one for duplicates.
    if (Object.keys(req.body).length===1) {
        var {title, instructions, instructionsHTML, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id, description } = req.body.params;
        //console.log(`Req Params: ${req.params}`);
        //console.log(`user id: ${userID}`);
        //console.log(`lesson id ${lessonID}`);
    }
    else {
        var {title, instructions, instructionsHTML, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id, description } = req.body;
        //console.log(`Req Body: ${req.body}`);
        //console.log(req.body);
        //console.log(`user id: ${userID}`);
        //console.log(`lesson id ${lessonID}`);
    }
    //console.log("Check 1");
    const lesson_title = await lessonSchema.findOne({ title: title })
    if (lesson_title&&lesson_title._id.toString()!==("6a7c94cb93b5021d439c6888"))
        return res.status(409).send({ message: "There is already a lesson with that title, please select another." })
    
    const lesson_order_within_chapter = await lessonSchema.findOne({chapter_no: chapter_no, order_within_chapter: order_within_chapter})
    //console.log(chapter_no);
    if (lesson_order_within_chapter&&lesson_order_within_chapter._id.toString()!==("6a7c94cb93b5021d439c6888"))
        return res.status(409).send({ message: "There's a pre-existing lesson with that order value in the same chapter, please select another." })

    const test_within_chapter = await lessonSchema.findOne({chapter_no: chapter_no, is_test: true})
    //console.log(chapter_no);
    if (test_within_chapter&&is_test) {
        is_test = false;
        return res.status(409).send({ message: "There is already a test within that chapter. Please refrain from adding another test." });
    }
    //console.log("Check 2");

    
    //creates the new lesson
    const createLesson = new lessonSchema({
        title: title,
        instructions: instructions,
        instructionsHTML: instructionsHTML,
        default_script: default_script,
        solution_verification: solution_verification,
        is_test: is_test,
        chapter_no: chapter_no,
        order_within_chapter: order_within_chapter,
        documentation_id: documentation_id,
        description: description
    });

   
    try {
        const saveNewLesson = await createLesson.save();
        res.send(saveNewLesson);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new lesson" });
    }

})

module.exports = router;