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
    // Check if deadline exists and is a valid date
    if (!this.deadline || this.deadline === null || this.deadline === undefined) {
        return null;
    }
    
    // Handle string deadlines or invalid dates
    let deadlineDate;
    try {
        deadlineDate = new Date(this.deadline);
        if (isNaN(deadlineDate.getTime())) {
            console.error('Invalid deadline date for project:', this.name, this.deadline);
            return null;
        }
    } catch (error) {
        console.error('Error parsing deadline for project:', this.name, error);
        return null;
    }
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        deadlineDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return daysDiff;
    } catch (error) {
        console.error('Error calculating days until deadline for project:', this.name, error);
        return null;
    }
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