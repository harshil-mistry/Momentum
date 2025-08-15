var express = require('express');
var router = express.Router();
const user = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const { body, validationResult, check } = require('express-validator');

//POST req for user signup
router.post('/signup', [

  //This middleware is for checking for proper parameters are being passde ot not
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
    jwt.sign(payload, config.get('jwtSecret'), (err, token)=>{
      if (err) throw err
      res.json({
        "status":"success",
        "token":token  
      })
    })

  } catch {
    res.status(500).json({
      "status": "failed",
      "error": "Some Internal Server error occured"
    })
  }

})

module.exports = router;
