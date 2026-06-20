const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const documentationSchema = require('../../models/documentationModel')


router.post('/make', async (req, res) => {
    const { shortID, title, description, content, author, reference_list} = req.body;
    //const lesson = await lessonSchema.find(lessonID)
    //console.log(lessons);
    //console.log("Gate 1");
    //creates the new lesson
    const createDocumentation = new documentationSchema({
        shortID: shortID, 
        title: title,
        description: description,
        content: content,
        author: author, 
        reference_list: reference_list
    });

    //console.log("Gate 2");
    try {
        //console.log(createDocumentation);
        const saveNewDocumentation = await createDocumentation.save();
        //console.log("Gate 3");
        res.send(saveNewDocumentation);
    } catch (error) {
        res.status(400).send({ message: "Error trying to create new documentation" });
    }

})

module.exports = router;