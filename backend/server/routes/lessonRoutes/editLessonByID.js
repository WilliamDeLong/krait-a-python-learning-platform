const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const lessonSchema = require('../../models/LessonModel')
const data_default = { title: "Placeholder title.", instructions: "You know how to make a print statement, right? Make one.", default_script: "#This is where you put YOUR code to be ran.", solution_verification: "print('Hello World')", is_test: false, chapter_no: 0, order_within_chapter: 0};


router.post("/:id/edit", async (req, res) =>
{
    //console.log("Gate 1");
    var { id } = req.params;
    // store new user information
    const data_2_check = req.body
    // I need all of the elements in an object so I can iterate through them
    
    //Due to lessons having default values, we need to set empty values to their defaults so that the system can check for duplicates accurately.
    Object.keys(data_default).forEach(element => {
        if (data_2_check[element] === undefined) 
            data_2_check[element] = data_default[element];
        //console.log(`Testing ${element}:\n\tDefault Value: ${data_default[element]}\n\tInputted Value: ${data_2_check[element]}\n\tComparison: ${data_default[element]===data_2_check[element]}`)
    });
    //console.log("Gate 2");
    // After we have our defaulted sets, we can now properly set them to their individual variables and check each one for duplicates.
    const {title, instructions, default_script, solution_verification, is_test, chapter_no, order_within_chapter, documentation_id } = data_2_check


    // check if lesson title is available
    const lesson = await lessonSchema.findOne({ title: title })
    //console.log("Gate 3");
    if (lesson) lessonIdReg = JSON.stringify(lesson._id).replace(/["]+/g, '')
    if (lesson && lessonIdReg !== id) return res.status(409).send({ message: "Lesson title is taken, pick another" })
    //console.log("Gate 4");
    // find and update lesson using stored information
    lessonSchema.findByIdAndUpdate(id, {
        title: title,
        instructions: instructions,
        default_script: default_script,
        solution_verification: solution_verification,
        is_test: is_test,
        chapter_no: chapter_no,
        order_within_chapter: order_within_chapter,
        documentation_id: documentation_id
    } ,function (err, lesson) {
    if (err){
        //console.log(err);
    } else {
        // create and send new access token to local storage
        //console.log("Gate 5");
        res.send({ lesson: lesson })
    }
    });

})

module.exports = router;