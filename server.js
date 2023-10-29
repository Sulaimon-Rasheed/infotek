const app = require("./app")
const db = require("./config/mongoose")
require("dotenv").config()

const PORT = process.env.PORT

db.connectToMongoDB()

app.listen(PORT, ()=>{
    console.log(`app listening at http://localhost:${PORT}`)
})