const mongoose = require('mongoose')
const config = require('config')
const dbURI = config.get("mongoURI")

const initDB = async () => {
    try{
        mongoose.connect(dbURI)
        console.log("Database initialized")
    } catch (err) {
        console.error("Error occured" + err.message)
        process.exit(1)
    }
}

module.exports = initDB