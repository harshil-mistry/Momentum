const mongoose = require('mongoose')

const NoteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "projects"
    }
}, {
    timestamps: true
})

const NoteModel = new mongoose.model('notes', NoteSchema)

module.exports = NoteModel