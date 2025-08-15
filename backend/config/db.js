const mongoose = require('mongoose')
const config = require('config')
const dbURI = config.get("mongoURI")
const user = require('../models/User')

const initDB = async () => {
    
    try{
        mongoose.connect(dbURI)
        console.log("Database initialized")

        //Adding an admin to the DB if doesn't exists already
        var admindata = await user.findOne({'isAdminUser':true})
        if (!admindata) {
            const bcrypt = require('bcryptjs')

            const name = "admin"
            const email = config.get('adminEmail')
            const password_str = config.get('adminPass')
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(password_str, salt)

            const isAdminUser = true
            const admin = new user({name, email, password, isAdminUser})
            admin.save().then(console.log("New Admin User added"))
        }
    } catch (err) {
        console.error("Error occured" + err.message)
        process.exit(1)
    }
}

module.exports = initDB