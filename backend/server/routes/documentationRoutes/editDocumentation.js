const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const documentationSchema = require('../../models/documentationModel')

router.post("/:id/edit", async (req, res) =>
{   
    //console.log("Gate 1");
    var { id } = req.params;
    if (Object.keys(req.body).length===1) {
        var { shortID, title, description, content, author, reference_list } = req.body.params;
        //console.log(`Req Params: ${req.params}`);
        //console.log(req.body.params);
        //console.log(`user id: ${userID}`);
        //console.log(`lesson id ${lessonID}`);
    }
    else {
        var { shortID, title, description, content, author, reference_list } = req.body;
        //console.log(`Req Body: ${req.body}`);
        //console.log(req.body);
        //console.log(`user id: ${userID}`);
        //console.log(`lesson id ${lessonID}`);
    }
    //const {title, description, content, author, reference_list } = req.body;
    //console.log(req.body);
    //console.log("Gate 1");

    // check if document title is available
    const doc = await documentationSchema.findOne({ title: title })
    //console.log("Gate 2");
    if (doc) docIdReg = JSON.stringify(id).replace(/["]+/g, '')
    if (doc && docIdReg !== id) return res.status(409).send({ message: "Documentation title is already in use, pick another" })
    //console.log("Gate 3");
    
    
    //console.log(content);
    // find and update document using stored information
    documentationSchema.findByIdAndUpdate(id, {
        shortID: shortID,
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
        //console.log("Gate 4");
        res.send({ documentation: documentation })
    }
    });

})

module.exports = router;