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

router.get('/:id', auth, async (req, res, next) => {
    const user_id = req.user
    const id = req.params.id
    try {
        const data = await project.findById(id)
        if (data.owner != user_id) {
            res.status(401).json()
        }
        res.json(data)
    } catch {
        res.send("Invalid Project ID entered")
    }
})

module.exports = router