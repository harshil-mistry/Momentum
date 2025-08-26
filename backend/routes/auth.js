var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
const adminauth = require('../middleware/admin')
const user = require('../models/User')
const project = require('../models/Project');
const Issue = require('../models/Issue');

//Testing User Auth
router.post('/', auth, async function (req, res, next) {
    const id = req.user
    const data = await user.findById(id)
    res.json(data)
});

//Testing Admin Auth
router.post('/admin', adminauth, async function (req, res, next) {
    const id = req.user
    const data = await user.findById(id)
    res.json(data)
});

//Fetching all the user data for testing
router.post('/data', adminauth, async function (req, res, next) {
    const data = await user.find({ 'isAdminUser': false }).select('-password')
    res.json(data)
})

//Fetching all the projects for testing
router.post('/projects', adminauth, async function (req, res, next) {
    const data = await project.find().populate('owner', ['name', 'email'])
    res.json(data)
})

//Fetching all issues for testing
router.post('/issues', adminauth, async (req, res) => {
    const data = await Issue.find().populate({
        path: 'project',
        populate: {
            path: 'owner'
        }
    })
    res.json(data)
})

module.exports = router;