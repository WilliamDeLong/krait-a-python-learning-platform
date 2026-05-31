const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const submissionSchema = require('../../models/codeSubmissionModel')
const mongoose = require("mongoose");

const lessonSchema = require('../../models/LessonModel')
const userSchema = require('../../models/userModel')


router.post("/:id/update", async (req, res) =>
{
    //console.log("Gate 1");
    const { id } = req.params;
    var {userID, lessonID, script_submission, success } = req.body

    //console.log(req.body);
    const lesson = await lessonSchema.findById(lessonID);
    if (!lesson)
        return res.status(409).send({ message: "That lesson does not exist." })
    //console.log("Gate 2");
    const user = await userSchema.findById(userID);
    if (!user)
        return res.status(409).send({ message: "That user does not exist." })

    //console.log("Gate 3");
    const sub = await submissionSchema.findById(id);
    const submission_date = sub.submission_date.setTime(Date.now());
    // find and update lesson using stored information
    submissionSchema.findByIdAndUpdate(id, {
        userID: userID,
        lessonID: lessonID,
        script_submission: script_submission,
        success: success,
        submission_date: submission_date
    } ,function (err, submission) {
    if (err){
        console.log(err);
    } else {
        // create and send new access token to local storage
        //console.log("Gate 4");
        res.send({ submission: submission })
    }
    });

})

module.exports = router;