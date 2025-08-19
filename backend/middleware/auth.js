const jwt = require('jsonwebtoken')
const config = require('config')
const user = require('../models/User')

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(401).json({
            "status": "failed",
            "errors": [{
                "msg": "No Authorization Token Found"
            }]
        })
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        const userdata = await user.findById(decoded.user.id);
        if (!userdata) {
            return res.status(401).json({
                status: "failed",
                errors: [{ msg: "User no longer exists" }]
            });
        }
        req.user = userdata.id
        console.log("In middleware, req user is : ", decoded.user.id)
        next()
    } catch (error){
        console.log(error)
        res.status(401).json({
            "status": "failed",
            "errors": [{
                "msg": "Invaid Authorization Token"
            }]
        })
    }
}