var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth')
const adminauth = require('../middleware/admin')
const user = require('../models/User')

//Testing User Auth
router.post('/', auth, async function(req, res, next) {
    const id = req.user
    const data = await user.findById(id)
    res.json(data)
});

//Testing Admin Auth
router.post('/admin', adminauth, async function(req, res, next) {
    const id = req.user
    const data = await user.findById(id)
    res.json(data)
});

//Fetching all the data for testing
router.post('/data', adminauth, async function (req, res, next) {
    const data = await user.find({'isAdminUser':false}).select('-password')
    res.json(data)
})

module.exports = router;