const mongoose = require('mongoose')
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

const Project = new mongoose.model('projects', ProjectSchema)

module.exports = Project