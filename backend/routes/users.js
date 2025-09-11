var express = require('express');
var router = express.Router();
const user = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')

const { body, validationResult, check } = require('express-validator');

//Fetch user details
router.get('/profile', auth, async (req, res) => {
  const userid = req.user
  const userdata = await user.findById(userid).select('-password -createdAt -__v')
  console.log(userdata)
  if (userdata) return res.json(userdata)
  else res.status(404).json({
    "status": "failed",
    "errors": [{
      "msg": "User not found"
    }]
  })
})

//Fetch dashboard stats
router.get('/dashboard-stats', auth, async (req, res) => {
  try {
    const userid = req.user
    const project = require('../models/Project')
    const issue = require('../models/Issue')
    
    // Get total projects count
    const totalProjects = await project.countDocuments({ owner: userid })
    
    // Get all issues for user's projects
    const userProjects = await project.find({ owner: userid }).select('_id')
    const projectIds = userProjects.map(proj => proj._id)
    
    // Get total issues count
    const totalIssues = await issue.countDocuments({ project: { $in: projectIds } })
    
    // Get pending issues count (status: 0 = pending, 1 = in progress, 2 = completed)
    const pendingIssues = await issue.countDocuments({ 
      project: { $in: projectIds }, 
      status: { $in: [0, 1] } // both pending and in-progress are considered "pending"
    })
    
    return res.json({
      status: "success",
      data: {
        totalProjects,
        totalIssues,
        pendingIssues
      }
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "status": "failed",
      "errors": [{
        "msg": "Internal Server Error"
      }]
    })
  }
})

//POST req for user signup
router.post('/signup', [

  //This middleware is for checking for proper parameters are being passde ot not (validation)
  body('name', 'Please enter a proper name').notEmpty(),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'The Password should have minimum 8 characters').isLength({
    min: 8
  })

], async function (req, res, next) {

  //Sending error JSON if there are errors present
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      "status": "failed",
      "errors": errors.array()
    })
  }


  try {
    const { name, email, password } = req.body

    //Checking whether a user already exists with the given email
    userdata = await user.findOne({ email })
    if (userdata) {
      return res.status(422).json({
        "status": "failed",
        "errors": [{ msg: "User already exists with this email id" }]
      })
    }

    //Generating password hash
    var salt = await bcrypt.genSalt(10)
    var password_hash = await bcrypt.hash(password, salt)

    //Saving new user
    newuser = new user({ name, email, password: password_hash })
    await newuser.save()

    //Preparing JWT
    const payload = {
      user: {
        id: newuser.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'),
      //Callback function with error and token
      (err, token) => {
        console.log('inside callback func')
        if (err) throw err;
        res.json({
          status: "success",
          message: "Successfully signed up",
          token: token
        });
      }
    )

  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "error": "Some Internal Server error occured"
    })
  }


});

//Signin Functionality
router.post('/signin', [

  //Validating inputs
  body('email', 'Please enter a valid email').notEmpty().isEmail(),
  body('password', 'The Password is required').notEmpty()

], async (req, res) => {

  //Checking for any error in data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({
      "status": "failed",
      "errors": errors.array()
    })
  }

  try {
    const { email, password } = req.body

    //Checking if a user exists or not
    var userdata = await user.findOne({ email })
    if (!userdata) {
      return res.status(401).json({
        "status": "failed",
        "errors": [{
          "msg": "No User found with this Email"
        }]
      })
    }

    //Verifying passwords
    const password_hash = userdata.get('password')
    console.log(`${password_hash} ${password}`)
    var valid = await bcrypt.compare(password, password_hash)
    if (!valid) {
      return res.status(401).json({
        "status": "failed",
        "errors": [{
          "msg": "Invalid Credentials"
        }]
      })
    }

    //Generating & sending JWT
    const payload = {
      user: {
        id: userdata.id
      }
    }
    jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
      if (err) throw err
      res.json({
        "status": "success",
        "token": token
      })
    })

  } catch {
    res.status(500).json({
      "status": "failed",
      "error": "Some Internal Server error occured"
    })
  }

})

//Change Password Functionality
router.put('/password', [auth, [
  body('old_password', 'Please enter existing password').notEmpty(),
  body('new_password', 'New password should be at least 8 characters').isLength({ min: 8 })
]], async (req, res) => {

  //Checking for errors in data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      "status": "failed",
      "errors": errors.array()
    })
  }

  //Fetching user details
  const { old_password, new_password } = req.body
  try {

    const data = await user.findById(req.user)
    const password = data.password
    //Checking for password mismatch
    const isCorrect = await bcrypt.compare(old_password, password)

    console.log(isCorrect)
    if (!isCorrect) {
      return res.status(422).json({
        "status": "failed",
        "errors": [{
          "msg": "Please enter correct existing password"
        }]
      })
    }

    const salt = await bcrypt.genSalt(10)
    const new_password_hash = await bcrypt.hash(new_password, salt)
    data.password = new_password_hash
    data.save()

    res.json({
      "status": "success",
      "message": "Password changed successfully"
    })


  } catch (err) {
    console.log(err)
    res.status(500).json({
      "status": "failed",
      "errors": [{
        "msg": "Internal Server Error"
      }]
    })
  }


})

//Delete User
router.delete('/', auth, async (req, res) => {
  try {
    const userdata = await user.findById(req.user)
    if (userdata) await userdata.deleteOne()
    else return res.status(401).json({
      "status": "failed",
      "errors": [{
        "msg": "No user found"
      }]
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "status": "failed",
      "errors": [{
        "msg": "Internal Server Error"
      }]
    })
  }
  res.json({
    "status": "success",
    "message": "User Deleted Successfully"
  })
})

module.exports = router;
