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

//Updating an issue
router.put('/:id', [auth, [
    body('name', 'Please enter a name').notEmpty(),
    body('status')
    .if(body('status').exists())
        .isInt().withMessage('Please enter an Integer Value')
    .isIn([0, 1, 2]).withMessage("The status must be from 0, 1 and 2"),
    body('priority')
    .if(body('priority').exists())
    .isInt().withMessage('Please enter an Integer Value')
    .isIn([0, 1, 2]).withMessage("The priority must be from 0, 1 and 2")
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

        //Checking for authorized access
        const issue_id = req.params.id
        const issue_data = await issue.findById(issue_id).populate('project')
        if (req.user != issue_data.project.owner) {
            return res.status(401).json({
                "status":"failed",
                "errors":[{
                    "msg":"Unauthorized access"
                }]
            })
        }

        //updating Issue
        const {name, description, status, priority} = req.body
        const new_issue = {
            name
        }
        new_issue.description = description? description : ""
        if (status) new_issue.status = status
        if (priority) new_issue.priority = priority
        
        const updated = await issue.findByIdAndUpdate(issue_id, new_issue)
        if(!updated) {
            return res.status(400).json({
                "status":"failed",
                "errors":[{
                    "msg":"Failed to update the issue"
                }]
            })
        }

        res.json({
            "status":"success",
            "message":"Issue updated successfully"
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

//Deleting an issue
router.delete('/:id', auth, async (req, res) => {

    try {

        //Checking for authorized access
        const issue_id = req.params.id
        const issue_data = await issue.findById(issue_id).populate('project')
        console.log(issue_data)
        if (req.user != issue_data.project.owner) {
            console.log(req.user, issue_data.owner)
            return res.status(401).json({
                "status":"failed",
                "errors":[{
                    "msg":"Unauthorized access"
                }]
            })
        }

       await issue.findByIdAndDelete(issue_id)

        res.json({
            "status":"success",
            "message":"Issue deleted successfully"
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

router.get('/:project_id', auth, async(req, res) => {

    try {

        //checking for authorization
        const project_id = req.params.project_id
        const project_data = await project.findById(project_id)
        if (project_data.owner != req.user) {
            res.status(401).json({
                "status":"failed",
                "errors":[{
                    "msg":"Unauthorized access"
                }]
            })
        }
        console.log(project_id)
        const issues = await issue.find({project:new mongoose.Types.ObjectId(project_id)})
        console.log(issues)
        res.json({
            "issues": issues
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status":"failed",
            "errors":[{
                "msg":"Internal Server Error"
            }]
        })
    }
})

//TO-DO : Changing the state of the issue (0 <-> 1 <-> 2)

module.exports = router