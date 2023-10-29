const joi = require("joi")

const validateBlogInfo = async (req, res, next)=>{
    try{
        const blogSchema = joi.object({
            title:joi.string().empty().required().messages({"string.base":`"title" must be of type "text"`,"string.empty":`"title" can not be empty`,"string.required": `"title" is required `}),
            description:joi.string().messages({"string.base":`"description" must be of type "text"`}),
            author:joi.string().messages({"string.base":`"author" must be of type "text"`}),
            state:joi.string().valid("draft", "published").messages({"string.base":`"state" must be of type "text"`}),
            read_count:joi.number().messages({"number.base":`"read_count" must be of type "number"`,"number.empty":`"number" can not be empty`,"number.required":`"number" is required ` }),
            tag:joi.string().messages({"string.base":`"tag" must be of type "text"`}),
            body:joi.string().empty().required().messages({"string.base":`"body" must be of type "text"`,"string.empty":`"body" can not be empty`,"string.required":`"body" is required ` }),
        }) 

        await blogSchema.validateAsync(req.body, {abortEarly:true})
        next()
    }
    catch(error){
        res.status(422).json({
            message:"invalid information",
            error:error.message
        })
    }
}

module.exports = {validateBlogInfo}