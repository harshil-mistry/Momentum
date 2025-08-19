const mongoose = require('mongoose')
const project = require('./Project')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdminUser: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        // console.log(`User with id ${doc.id} and name ${doc.name} and email ${doc.email} is deleted`)
        console.log(this)
        const projects = await project.find({owner:this._id})
        console.log(projects)
        projects.forEach(async function (project) {
            // const projectdetails = project.findById(project._id)
            // await projectdetails.deleteOne()
            await project.deleteOne()
        });
        console.log("In middleware")
    } catch (error) {
        console.log(error)
    }
    next()
})

const user = new mongoose.model('user', userSchema)

module.exports = user