const jwt = require('jsonwebtoken')
const config = require('config')
const user = require('../models/User')

//Reminder: Keep await before using this admin miffleware idk might not work
module.exports = async (req, res, next) => {
    console.log("Admin auth started")
    //Checking if token exists or not
    const token = req.header('x-auth-token')
    if (!token) {
        return res.status(401).json({
            "status": "failed",
            "errors": [{
                "msg": "No Authentication Token Found"
            }]
        })
    }

    try {
        //Checking whether user is admin or not

        //Decoding JWT
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        //Fetching ID
        const id = decoded.user.id
        //Fetching user details
        const adminData = await user.findById(id)
        if (!adminData) {
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "Authorization Token not valid"
                }]
            })
        }
        //Checking if user is Admin ot not
        const isAdmin = adminData.isAdminUser
        console.log(isAdmin)
        if(!isAdmin){
            return res.status(401).json({
                "status": "failed",
                "errors": [{
                    "msg": "Unauthorized Access"
                }]
            })

        }
        req.user = id
        next()
    } catch {
        return res.status(500).json({
            "status": "failed",
            "errors": [{
                "msg": "Intenal Server Error"
            }]
        })
    }

}