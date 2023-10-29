const express = require ("express")
const middleware = require("./middleware.user")
const controller = require("./controller.user")
const cookieParser = require("cookie-parser")

const userRouter = express.Router()

userRouter.use(cookieParser())


// Creation of users
userRouter.post("/signup", middleware.validateUser, async (req,res)=>{
    const response = await controller.createUser({
        email:req.body.email,
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        password:req.body.password
    })
    if(response.code === 200){
        res.redirect("/login")
    }else{
        res.redirect("/existingUser")
    }
})


//Logging in users
userRouter.post("/login", middleware.validateLogInfo, async(req,res)=>{
    const response = await controller.login({email:req.body.email, password:req.body.password})
    if(response.code === 200){
        res.cookie("jwt", response.token, {maxAge:60 * 60 * 1000})
        res.redirect("/dashboard")
    }else if(response.code === 404){      
        res.redirect("/userNotFound")
    }else if(response.code === 422){
        res.redirect("/invalidInfo")     
    }else{
        res.redirect("/serverError")
    }
})

module.exports = userRouter