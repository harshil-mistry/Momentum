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
    deadline: {
        type: Date,
        required: false
    }
}, {
    timestamps:true
})

// Method to check if project is overdue
ProjectSchema.methods.isOverdue = function() {
    if (!this.deadline) return false;
    return new Date() > this.deadline;
};

// Method to get days until deadline
ProjectSchema.methods.getDaysUntilDeadline = function() {
    if (!this.deadline) return null;
    const today = new Date();
    const deadline = new Date(this.deadline);
    const timeDiff = deadline.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
};

// Method to get deadline status
ProjectSchema.methods.getDeadlineStatus = function() {
    if (!this.deadline) return 'no-deadline';
    
    const daysUntil = this.getDaysUntilDeadline();
    
    if (daysUntil < 0) return 'overdue';
    if (daysUntil === 0) return 'due-today';
    if (daysUntil <= 3) return 'due-soon';
    if (daysUntil <= 7) return 'due-this-week';
    return 'upcoming';
};

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