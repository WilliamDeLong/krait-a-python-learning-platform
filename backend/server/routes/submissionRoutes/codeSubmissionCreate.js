const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const submissionSchema = require('../../models/codeSubmissionModel')
const lessonSchema = require('../../models/LessonModel')
const userSchema = require('../../models/userModel')
//const data_default = { title: "Placeholder title.", instructions: "You know how to make a print statement, right? Make one.", default_script: "#This is where you put YOUR code to be ran.", solution_verification: "print('Hello World')", is_test: false, chapter_no: 0, order_within_chapter: 0};

router.post('/create', async (req, res) => {
    const { userID, lessonID} = req.body;
    var script_submission;
    //console.log(req.body);
    //console.log(lessonID);
    const lesson = await lessonSchema.findById(lessonID)
    //console.log(lesson);
    if (!lesson)
        return res.status(409).send({ message: "That lesson does not exist." })

    const user = await userSchema.findById(userID)
    if (!user)
        return res.status(409).send({ message: "That user does not exist." })
    
    
    const submission = await submissionSchema.findOne({ userID: userID, lessonID: lessonID })
    if (submission)
        return res.status(409).send({ message: "There is already a submission for this lesson by that user." })
    else {
        script_submission = lesson.default_script;
    }
    //console.log("Check 2");
    //creates the new lesson
    const createSubmissionInstance = new submissionSchema({
        userID: userID,
        lessonID: lessonID,
        script_submission: script_submission
    });

    //console.log("Check 3");
    try {
        //console.log(createSubmissionInstance);
        const saveNewSubmission = await createSubmissionInstance.save();
        res.send(saveNewSubmission);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new submission" });
    }

})

module.exports = router;