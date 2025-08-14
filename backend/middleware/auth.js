const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token){
        return res.status(401).json({
            "status":"failed",
            "errors":[{
                "msg":"No Authorization Token Found"
            }]
        })
    }
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user.id
        next()
    } catch {
        res.status(401).json({
            "status":"failed",
            "errors":[{
                "msg":"Invaid Authorization Token"
            }]
        })
    }

}