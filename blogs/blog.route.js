const express = require ("express")
const middleware = require("./middleware.blog")
const controller = require("./controller.blog")
const auth = require("../authentication/auth")
const cookieParser = require("cookie-parser")

const blogRouter = express.Router()

blogRouter.use(cookieParser())


// Blog creation 
blogRouter.post("/create",auth.ensureLogin, middleware.validateBlogInfo, async (req,res)=>{
    let body = req.body.body
   let bodyWordsArray = body.split(" ")
   let count = 0
   bodyWordsArray.forEach(word=>{
    count++
   })
   let blogWordsCount = count
   let readingTime = blogWordsCount / 200

   const authorUpperCase = req.body.author.toUpperCase()
   const tagUpperCase = req.body.tag.toUpperCase()
   const titleUpperCase = req.body.title.toUpperCase()

    const response = await controller.createBlog(
        {title:titleUpperCase, 
         description:req.body.description,
         author:authorUpperCase,
         state:"draft",
         read_count:0,
         reading_time:`${readingTime} min`,
         tag:tagUpperCase,
         body:req.body.body,
         drafted_timestamp:new Date(),
         published_timestamp:0,
         user_id:res.locals.user._id
        }
     )

    if(response.code===200){
        res.redirect("/dashboard")
    }else{
        res.redirect("/invalid_info")
    }
} )

blogRouter.post("/updateState/:id",auth.ensureLogin, controller.updateState)
blogRouter.post("/deleOneBlog/:id",auth.ensureLogin, controller.deleteBlog)
blogRouter.post("/updateBody/:id",auth.ensureLogin, controller.updateBody)
blogRouter.post("/readCount/:id", controller.readCount)
blogRouter.get("/sort", controller.sort)
blogRouter.get("/ownersBlog",auth.ensureLogin, controller.readOwnersBlog)
blogRouter.get("/readBlog", controller.readBlog)


module.exports = blogRouter