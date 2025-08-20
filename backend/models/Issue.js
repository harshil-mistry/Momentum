const mongoose = require('mongoose')

const IssueSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    issue:{
        type:String,
        required:true
    },
    project:{
        type:mongoose.Types.ObjectId,
        ref:"projects"
    }
})

const Issue = mongoose.model('issues', IssueSchema)

module.exports = Issue