const mongoose = require('mongoose')
const Issue = require('./Issue')
const Note = require('./Note')
const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {
    timestamps:true
})

ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        // console.log(`User with id ${doc.id} and name ${doc.name} and email ${doc.email} is deleted`)
        console.log(this)
        const Issues = await Issue.find({project:this._id})
        console.log(Issues)
        Issues.forEach(async function (issue_data) {
            // const projectdetails = project.findById(project._id)
            // await projectdetails.deleteOne()
            await issue_data.deleteOne()
        });
        const Notes = await Note.find({project:this._id})
        console.log(Notes)
        Notes.forEach(async function (note_data) {
            // const projectdetails = project.findById(project._id)
            // await projectdetails.deleteOne()
            await note_data.deleteOne()
        });
        console.log("In middleware")
    } catch (error) {
        console.log(error)
    }
    next()
})

const Project = new mongoose.model('projects', ProjectSchema)

module.exports = Project