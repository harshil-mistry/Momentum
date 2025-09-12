const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const project = require('../models/Project')
const Issue = require('../models/Issue')
const Note = require('../models/Note')
const { body, validationResult, check } = require('express-validator');

//Route to fetch all projects for the user
router.get('/', auth, async (req, res, next) => {
    try {
        const projects = await project.find({ owner: req.user })
        
        // Calculate completion percentage for each project
        const projectsWithCompletion = await Promise.all(
            projects.map(async (proj) => {
                // Find all issues for this project
                const totalIssues = await Issue.countDocuments({ project: proj._id })
                
                if (totalIssues === 0) {
                    // If no issues exist, completion is 0%
                    return {
                        ...proj.toObject(),
                        completionPercentage: 0,
                        totalIssues: 0,
                        completedIssues: 0
                    }
                }
                
                // Find completed issues (status = 2)
                const completedIssues = await Issue.countDocuments({ 
                    project: proj._id, 
                    status: 2 
                })
                
                // Calculate completion percentage
                const completionPercentage = Math.round((completedIssues / totalIssues) * 100)
                
                // Add deadline information
                const projectObj = proj.toObject()
                const daysUntilDeadline = proj.getDaysUntilDeadline()
                const isOverdue = proj.isOverdue()
                const deadlineStatus = proj.getDeadlineStatus()
                
                // Ensure daysUntilDeadline is properly handled for serialization
                const safeProject = {
                    ...projectObj,
                    completionPercentage,
                    totalIssues,
                    completedIssues,
                    daysUntilDeadline: daysUntilDeadline !== null ? daysUntilDeadline : undefined,
                    isOverdue: Boolean(isOverdue),
                    deadlineStatus: deadlineStatus || 'no-deadline'
                }
                
                // Debug logging for projects with deadlines
                if (proj.deadline) {
                    console.log('Backend - Project with deadline:', {
                        name: proj.name,
                        deadline: proj.deadline,
                        daysUntilDeadline: safeProject.daysUntilDeadline,
                        isOverdue: safeProject.isOverdue,
                        deadlineStatus: safeProject.deadlineStatus,
                        originalDaysUntil: daysUntilDeadline
                    });
                }
                
                return safeProject
            })
        )
        
        res.json(projectsWithCompletion)
    } catch (error) {
        console.error('Error fetching projects with completion:', error)
        res.status(500).json({
            status: 'failed',
            errors: [{
                msg: 'Internal Server Error'
            }]
        })
    }
})

//Route to add a new Project
router.post('/', [auth, [
    body('name', 'Please enter a name').notEmpty(),
    body('deadline', 'Deadline must be a valid date').if(body('deadline').exists()).isISO8601()
]], async (req, res, next) => {

    //Performing data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            "status": "failed",
            "errors": errors.array()
        })
    }

    //Creating a new Project
    const { name, description, deadline } = req.body
    const project_data = {
        name,
        owner: req.user
    }
    if (description) project_data.description = description
    if (deadline) project_data.deadline = new Date(deadline)

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

//Get a single project details
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

        // Calculate completion percentage for this project
        const totalIssues = await Issue.countDocuments({ project: id })
        
        let completionPercentage = 0
        let completedIssues = 0
        
        if (totalIssues > 0) {
            completedIssues = await Issue.countDocuments({ 
                project: id, 
                status: 2 
            })
            completionPercentage = Math.round((completedIssues / totalIssues) * 100)
        }

        // Add deadline information
        const daysUntilDeadline = data.getDaysUntilDeadline()
        const isOverdue = data.isOverdue()
        const deadlineStatus = data.getDeadlineStatus()

        // Debug logging for single project with deadline
        if (data.deadline) {
            console.log('Backend - Single project with deadline:', {
                name: data.name,
                deadline: data.deadline,
                daysUntilDeadline,
                isOverdue,
                deadlineStatus
            });
        }

        const projectWithCompletion = {
            ...data.toObject(),
            completionPercentage,
            totalIssues,
            completedIssues,
            daysUntilDeadline,
            isOverdue,
            deadlineStatus
        }

        res.json(projectWithCompletion)
    } catch (error) {
        console.error('Error fetching project details:', error)
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
    body('name', 'Please enter a name').notEmpty(),
    body('deadline', 'Deadline must be a valid date').if(body('deadline').exists()).isISO8601()
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

    const { name, description, deadline } = req.body
    const project_data = {
        name,
        description,
        owner: req.user
    }
    
    // Handle deadline field
    if (deadline !== undefined) {
        if (deadline === null || deadline === '') {
            project_data.deadline = null
        } else {
            project_data.deadline = new Date(deadline)
        }
    }

    //updating project details
    try {
        const updated_project = await project.findByIdAndUpdate(project_id, project_data, { new: true })
        if (!updated_project) {
            return res.status(400).json({
                "status": "failed",
                "errors": [{
                    "msg": "Failed to update the document"
                }]
            })
        }

        // Calculate completion percentage for the updated project
        const totalIssues = await Issue.countDocuments({ project: project_id })
        
        let completionPercentage = 0
        let completedIssues = 0
        
        if (totalIssues > 0) {
            completedIssues = await Issue.countDocuments({ 
                project: project_id, 
                status: 2 
            })
            completionPercentage = Math.round((completedIssues / totalIssues) * 100)
        }

        // Add deadline information
        const daysUntilDeadline = updated_project.getDaysUntilDeadline()
        const isOverdue = updated_project.isOverdue()
        const deadlineStatus = updated_project.getDeadlineStatus()

        const projectWithCompletion = {
            ...updated_project.toObject(),
            completionPercentage,
            totalIssues,
            completedIssues,
            daysUntilDeadline,
            isOverdue,
            deadlineStatus
        }

        res.json(projectWithCompletion)
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

    //Deleting the project and all related data
    try {
        const project_data = await project.findById(project_id)
        if (!project_data) {
            return res.status(404).json({
                "status": "failed",
                "errors": [{
                    "msg": "Project not found"
                }]
            })
        }

        // Delete all related issues
        const deletedIssues = await Issue.deleteMany({ project: project_id })
        console.log(`Deleted ${deletedIssues.deletedCount} issues for project ${project_id}`)

        // Delete all related notes
        const deletedNotes = await Note.deleteMany({ project: project_id })
        console.log(`Deleted ${deletedNotes.deletedCount} notes for project ${project_id}`)

        // Finally delete the project itself
        await project_data.deleteOne()
        console.log(`Deleted project ${project_id}`)

        return res.json({
            "status": "success",
            "message": "Project and all related data deleted successfully",
            "details": {
                "deletedIssues": deletedIssues.deletedCount,
                "deletedNotes": deletedNotes.deletedCount
            }
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