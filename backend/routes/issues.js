const express = require('express')
var router = express.Router()
const issue = require('../models/Issue')
const auth = require('../middleware/auth')
const { body, validationResult, check } = require('express-validator');

//Adding a new issue
router.post('/:project_id', [auth, [
    body('name', 'Please enter a name').notEmpty(),
]], (req, res) => {

    //Performing data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            "status": "failed",
            "errors": errors.array()
        })
    }

    //Check whether project exists or not
    //Check whether user owns the project or not
    //Add issue

})

//TO-DO : Updating an issue
//TO-DO : Deleting an issue
//TO-DO : Fetching all issues of a project
//TO-DO : Changing the state of the issue (0 <-> 1 <-> 2)

module.exports = router