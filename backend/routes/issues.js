const express = require('express')
var router = express.Router()
const issue = require('../models/Issue')
const project = require('../models/Project')
const auth = require('../middleware/auth')
const { body, validationResult, check } = require('express-validator');
const { default: mongoose } = require('mongoose')

//Adding a new issue
router.post('/:project_id', [auth, [
    body('name', 'Please enter a name').notEmpty(),
]], async (req, res) => {

    //Performing data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            "status": "failed",
            "errors": errors.array()
        })
    }

    try {
        //Check whether project exists or not
        const project_id = req.params.project_id
            const project_data = await project.findById(project_id)
            if (!project_data) {
                return res.status(404).json({
                    "status":"failed",
                    "errors":[{
                        "msg":"Project not found"
                    }]
                })
            }

        //Check whether user owns the project or not
        if (project_data.owner != req.user) {
            return res.status(401).json({
                "status":"failed",
                "errors":[{
                    "msg":"You are not authorized for this project"
                }]
            })
        }

        const {name, description} = req.body

        //Add issue
        const Issue_data = issue({
            name, 
            project: project_id
        })
        if (description) Issue_data.description = description
        
        await Issue_data.save()
        return res.json({
            "status":"success",
            "message":"Issue added successfully"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "status":"failed",
            "errors":[{
                "msg":"Internal Server Error"
            }]
        })
    }

})

//TO-DO : Updating an issue
//TO-DO : Deleting an issue
//TO-DO : Fetching all issues of a project
//TO-DO : Changing the state of the issue (0 <-> 1 <-> 2)

module.exports = router