const jwt = require("jsonwebtoken")
require("dotenv").config()

const ensureLogin = async (req,res, next)=>{
  try{
    const token = req.cookies.jwt
    if(!token){
        res.redirect("/login")
    }
    const decoded = await jwt.verify(token , process.env.JWT_SECRET)
    res.locals.user = decoded
    next()
  }  
  catch(err){
    console.log(err.message)
  }
}

module.exports = {ensureLogin}