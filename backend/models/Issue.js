const mongoose = require('mongoose')

const IssueSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    description:{
        type:String
    },
    project:{
        type:mongoose.Types.ObjectId,
        ref:"projects"
    },
    status:{
        type:Number,
        enum:{
            values:[0, 1, 2],
            message:"Invalid Status number entered"
        }
    },
    priority:{
        type:Number,
        enum:[0, 1, 2]
    }
})

const Issue = mongoose.model('issues', IssueSchema)

module.exports = Issue