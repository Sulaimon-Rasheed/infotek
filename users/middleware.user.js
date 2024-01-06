const joi = require("joi")

const validateUser = async (req, res, next)=>{
    try{
        const userSchema = joi.object({
            email:joi.string().empty().email().required().messages({"string.base":`"Email" must be of type "text"`,"string.empty":`"Email" can not be empty`,"string.required": `"Email" is required`}),
            first_name:joi.string().empty().required().messages({"string.base":`"First name" must be of type "text"`,"string.empty":`"First name" can not be empty`,"string.required": `"First name" is required `}),
            last_name:joi.string().empty().required().messages({"string.base":`"Last name" must be of type "text"`,"string.empty":`"Last name" can not be empty`,"string.required": `"Last name" is required `}),
            password:joi.string().empty().required().min(8).messages({"string.base":`"Password" must be of type "text"`,"string.empty":`"Password" can not be empty`,
            "string.required": `"Password" is required `,"string.min":`"Password" should have a minimum length of {8}`}),
        })

        userSchema.validate(req.body)
        next()
    }
    catch(error){
       res.render("credentialsError", {error:error.message, navs:["Signup", "Login"]})
    
    }
}

const validateLogInfo = async (req, res, next)=>{
    try{const userSchema = joi.object({
         email:joi.string().email().empty().required().messages({"string.base":`"Email" must be of type string`,
         "string.required":`"Email" is required`,"string.empty":`"Email" can not be empty`}),
         password:joi.string().empty().required().messages({"string.base":`"Password" must be of type string`,
         "string.required":`"Password" is required`,"string.empty":`"Password" can not be empty`})
     })
 
     await userSchema.validateAsync(req.body, {abortEarly:true})
     next()
     }
     catch(error){
        res.render("credentialsError", {error:error.message, navs:["Signup", "Login"]})

     }
 }

module.exports = {validateUser, validateLogInfo }