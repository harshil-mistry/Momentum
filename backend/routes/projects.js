const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const project = require('../models/Project')
const { body, validationResult, check } = require('express-validator');

//Route to fetch all projects for the user
router.get('/', auth, async (req, res, next) => {
    const data = await project.find({ owner: req.user })
    res.json(data)
})

//Route to add a nre Project
router.post('/', [auth, [
    body('name', 'Please enter a name').notEmpty(),
]], async (req, res, next) => {

    //Performing data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            "status": "failed",
            "errors": errors.array()
        })
    }

    //Creting a new Project
    const { name, description } = req.body
    const project_data = {
        name,
        owner: req.user
    }
    if (description) project_data.description = description

    const new_project = await new project(project_data)

    //Saving new Project and returning id of new Project
    try {
        await new_project.save()
        res.json({
            "status": "success",
            "message": "Project Created Successfully",
            "id": new_project.id
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }
})

//Get a single project detialss
router.get('/:id', auth, async (req, res, next) => {
    const user_id = req.user
    const id = req.params.id
    try {
        const data = await project.findById(id)
        if (data.owner != user_id) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "You do not have access to this Project"
                }]
            })
        }
        res.json(data)
    } catch {
        res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }
})

//updating project details
router.put('/:id', [auth, [
    body('name', 'Please enter a name').notEmpty()
]], async (req, res) => {

    //Performing data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            "status": "failed",
            "errors": errors.array()
        })
    }

    //Checking for user ownership
    const project_id = req.params.id
    const user_id = req.user
    try {
        const data = await project.findById(project_id)
        const project_owner = data.owner
        console.log(project_owner)
        console.log(user_id)

        if (project_owner != user_id) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "You are not authorized for this project"
                }]
            })
        }

    } catch (error) {
        return res.status(404).json({
            "status": "failed",
            "errors": [{
                "msg": "No Project found with the given ID"
            }]
        })
    }

    const { name, description } = req.body
    const project_data = {
        name,
        description,
        owner: req.user
    }

    //updating project details
    try {
        const updated_project = await project.findByIdAndUpdate(project_id, project_data)
        if (!updated_project) {
            return res.status(400).json({
                "status": "failed",
                "errors": [{
                    "msg": "Failed to update the document"
                }]
            })
        }
        res.json({
            "status": "success",
            "message": "Project Details Updated",
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Internal Server Error"
            }]
        })
    }
})

//deleting project details
router.delete('/:id', [auth], async (req, res) => {

    //Checking for user ownership
    const project_id = req.params.id
    const user_id = req.user
    try {
        const data = await project.findById(project_id)
        const project_owner = data.owner
        console.log(project_owner)
        console.log(user_id)

        if (project_owner != user_id) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "You are not authorized for this project"
                }]
            })
        }

    } catch (error) {
        return res.status(404).json({
            "status": "failed",
            "errors": [{
                "msg": "No Project found with the given ID"
            }]
        })
    }

    //Deleting the project
    try {
        await project.findOneAndDelete({ _id: project_id })
        return res.json({
            "status": "success",
            "message": "Project Deleted Successfully"
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