const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const documentationSchema = require('../../models/documentationModel')

router.post("/:id/edit", async (req, res) =>
{
    //console.log("Gate 1");
    var { id } = req.params;
    const {title, description, content, author, reference_list } = req.body;


    // check if lesson title is available
    const doc = await documentationSchema.findOne({ title: title })
    //console.log("Gate 2");
    if (doc) docIdReg = JSON.stringify(id).replace(/["]+/g, '')
    if (doc && docIdReg !== id) return res.status(409).send({ message: "Documentation title is already in use, pick another" })
    //console.log("Gate 3");
    //console.log("Gate 4");
    
    //console.log("Gate 5");
    // find and update lesson using stored information
    documentationSchema.findByIdAndUpdate(id, {
        title: title,
        description: description,
        content: content,
        author: author, 
        reference_list: reference_list
    }, {new: true} ,function (err, documentation) {
    if (err){
        console.log(err);
    } else {
        // create and send new access token to local storage
        //console.log("Gate 5");
        res.send({ documentation: documentation })
    }
    });

})

module.exports = router;