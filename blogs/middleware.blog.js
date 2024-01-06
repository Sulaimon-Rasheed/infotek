const joi = require("joi")
const { DateTime } = require('luxon')
const blogModel = require("../models/blog")
// const client = require("../Utils/redis")
const Cache = require("../Utils/nodeCache")

const validateBlogInfo = async (req, res, next)=>{
    try{
        const blogSchema = joi.object({
            tag:joi.string().messages({"string.base":`"tag" must be of type "text"`}),
            title:joi.string().empty().required().messages({"string.base":`"title" must be of type "text"`,"string.empty":`"title" can not be empty`,"string.required": `"title" is required `}),
            description:joi.string().messages({"string.base":`"description" must be of type "text"`}),
            author:joi.string().messages({"string.base":`"author" must be of type "text"`}),
            state:joi.string().valid("draft", "published").messages({"string.base":`"state" must be of type "text"`}),
            read_count:joi.number().messages({"number.base":`"read_count" must be of type "number"`,"number.empty":`"number" can not be empty`,"number.required":`"number" is required ` }),
           
            content:joi.string().empty().required().messages({"string.base":`"content" must be of type "text"`,"string.empty":`"content" can not be empty`,"string.required":`"content" is required ` }),
        }) 

        await blogSchema.validateAsync(req.body, {abortEarly:true})
        next()
    }
    catch(error){
        res.render("credentialsError", {error:error.message, navs:["Create_blog"]})
    }
}

const getPassdays = async (req, res, next)=>{
  try{
    const blogs = await blogModel.find()
    blogs.forEach(blog=>{
        let postDate = blog.published_timestamp
        let parsedDate = DateTime.fromFormat( postDate, 'LLL d, yyyy \'at\' HH:mm');
        let currentDate = DateTime.now()
        let passdays = currentDate.diff(parsedDate, 'days').toObject().days;
        res.locals.passdays = passdays
        next()
    })
  }catch(err){
    res.render("pageNotFound", {navs:["Home"]})
  } 
    
}

//redis configuration
const findBlogFromCache = async (req,res,next)=>{
  const id = req.params.id
  const cacheKey = `blog-${id}`
  const blog = await Cache.get(cacheKey)
  if(blog){
    console.log("cache hit")
    blog.read_count++
    blog.save()
    return res.render("singleBlog",{
    blog
   })
  }
  next()
}




module.exports = {validateBlogInfo, getPassdays, findBlogFromCache}