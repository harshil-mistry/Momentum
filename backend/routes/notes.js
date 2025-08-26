const express = require('express')
var router = express.Router()
const note = require('../models/Note')
const project = require('../models/Project')
const auth = require('../middleware/auth')
const { body, validationResult, check } = require('express-validator');
const { default: mongoose } = require('mongoose')

//Adding a new note
router.post('/:project_id', [auth, [
    body('name', 'Please enter note title').notEmpty(),
    body('content', 'Please enter note content').notEmpty(),
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
                "status": "failed",
                "errors": [{
                    "msg": "Project not found"
                }]
            })
        }

        //Check whether user owns the project or not
        if (project_data.owner != req.user) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "You are not authorized for this project"
                }]
            })
        }

        const { name, content } = req.body

        //Add note
        const Note_data = note({
            name,
            content,
            project: project_id
        })

        await Note_data.save()
        return res.json({
            "status": "success",
            "message": "Note added successfully"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }

})

//Updating a note
router.put('/:id', [auth, [
    body('name', 'Please enter note title').notEmpty(),
    body('content', 'Please enter note body').notEmpty()
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
        const noteid = req.params.id
        const note_data = await note.findById(noteid).populate('project')
        if (req.user != note_data.project.owner) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "Unauthorized access"
                }]
            })
        }

        //updating Issue
        const { name, content} = req.body
        const new_note = {
            name,
            content
        }

        const updated = await note.findByIdAndUpdate(noteid, new_note)
        if (!updated) {
            return res.status(400).json({
                "status": "failed",
                "errors": [{
                    "msg": "Failed to update the issue"
                }]
            })
        }

        res.json({
            "status": "success",
            "message": "Note updated successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
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
                "status": "failed",
                "errors": [{
                    "msg": "Unauthorized access"
                }]
            })
        }

        await issue.findByIdAndDelete(issue_id)

        res.json({
            "status": "success",
            "message": "Issue deleted successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }
})

//Get all the issues for a particular project
router.get('/:project_id', auth, async (req, res) => {

    try {

        //checking for authorization
        const project_id = req.params.project_id
        const project_data = await project.findById(project_id)
        if (project_data.owner != req.user) {
            res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "Unauthorized access"
                }]
            })
        }
        console.log(project_id)
        const issues = await issue.find({ project: new mongoose.Types.ObjectId(project_id) })
        console.log(issues)
        res.json({
            "issues": issues
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }
})

//Change the status of the issue
router.patch('/:id', [auth, [
    body('status')
        .notEmpty().withMessage("A status is required")
        .isInt().withMessage("The status has to be an integer")
        .isIn([0, 1, 2]).withMessage("Status need to be from 0, 1 and 2")
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
                "status": "failed",
                "errors": [{
                    "msg": "Unauthorized access"
                }]
            })
        }
        const newstatus = req.body.status
        issue_data.status = newstatus
        await issue_data.save()

        res.json({
            "status": "success",
            "message": "Issue status changed successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })

    }
})

module.exports = router