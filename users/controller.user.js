const userModel = require("../models/user")
const blogModel = require("../models/blog")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const logger = require('../logger');


// Users creation service function
const createUser = async ({email, first_name, last_name, password})=>{
  logger.info('[CreateUser] => Signup process started')
    const userInfo = {email, first_name, last_name, password}
    const existingUser = await userModel.findOne({email:userInfo.email})
    if(existingUser){
      return{
        message:"user already exist",
        code:409
      }
    }
    const newUser = await userModel.create({
        email:userInfo.email,
        first_name:userInfo.first_name,
        last_name:userInfo.last_name,
        password:userInfo.password
    })
    logger.info(`[CreateUser] => User with email ${newUser.email} created successfully`)
    return{
        message:"User created successfully",
        code:200,
        newUser
    }
}


//Logging in service function
const login = async ({email, password})=>{
  try{
    logger.info('[Authenticate user] => login process started')
   
    const logInfo = {email, password}

    const user = await userModel.findOne({email:logInfo.email})
    if(!user){
      return{
        code:404,
        message:"User not found"
      }
    }
    const validPassword = await user.isValidPassword(logInfo.password)
      if(!validPassword){
        return{
          code:422,
          message:"email or password is incorrect",
        }  
      }
  
    const token = await jwt.sign({_id:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn:"1h"})
    logger.info('[Give user access] => login process successful')
    return{
      message:"successful login",
      code:200,
      user,
      token
    
    }
  }catch(err){
    logger.error(err.message);
    return{
      message: 'Server Error',
      code:500,
      data: null
    }
  }
  

}

module.exports = {createUser,login}