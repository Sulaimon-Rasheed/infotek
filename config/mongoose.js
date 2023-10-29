const mongoose = require("mongoose")
require("dotenv").config()

const connectToMongoDB = ()=>{
    mongoose.connect(process.env.DB_URL)

    mongoose.connection.on("connected", ()=>{
        console.log("connection to database is successful")
    })

    mongoose.connection.on("error", (err)=>{
        console.log("connection to database failed", err)
    })
}

module.exports = {connectToMongoDB}