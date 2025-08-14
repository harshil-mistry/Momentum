var express = require('express');
var router = express.Router();

const { body, validationResult } = require('express-validator');

/* POST users listing. */
router.post('/', [

  //This middleware is for checking for proper parameters are being passde ot not
  body('name', 'Please enter a proper name').notEmpty(),
  body('email', 'Please enter a valid email').isEmail(),
  body('password', 'The Password should have minimum 8 characters').isLength({
    min: 8
  })

], function (req, res, next) {

  const errors = validationResult(req)

  console.log(req.body)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      "status": "failed",
      "errors": errors.array()
    })
  }

  res.json({
    status: "success",
    message: "Successfully signed up"
  });

});

module.exports = router;
