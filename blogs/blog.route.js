const express = require ("express")
const middleware = require("./middleware.blog")
const controller = require("./controller.blog")
const auth = require("../authentication/auth")
const {DateTime} = require("luxon")
const blogRouter = express.Router()

// Blog creation 
blogRouter.post("/create",auth.ensureLogin, middleware.validateBlogInfo, async (req,res)=>{
    let rawContent = req.body.content
   let bodyWordsArray = rawContent.split(" ")
   let count = 0
   bodyWordsArray.forEach(word=>{
    count++
   })
   let blogWordsCount = count
   let readTime = blogWordsCount / 200
   let readingTime = Math.round(readTime)

   const authorUpperCase = req.body.author.toUpperCase()
   const tagUpperCase = req.body.tag.toUpperCase()
   const titleUpperCase = req.body.title.toUpperCase()
   const time = DateTime.now().toFormat('LLL d, yyyy \'at\' HH:mm')
    const response = await controller.createBlog(
        {title:titleUpperCase, 
         description:req.body.description,
         author:authorUpperCase,
         state:"draft",
         read_count:0,
         reading_time:`${readingTime} min`,
         tag:tagUpperCase,
         body:rawContent,
         drafted_timestamp:time,
         published_timestamp:0,
         user_id:res.locals.user._id
        }
     )

    if(response.code===200){
        req.flash("messageInfo", "Blog created successfully")
        res.redirect("/create_blog")
    }else{
        res.redirect("/invalid_info")
    }
} )

blogRouter.use("/public", express.static("public"));


blogRouter.post("/updateState/:id",auth.ensureLogin, controller.updateState)
blogRouter.post("/deleOneBlog/:id",auth.ensureLogin, controller.deleteBlog)
blogRouter.post("/updateBody/:id",auth.ensureLogin, controller.updateBody)
blogRouter.post("/readCount/:id", controller.readCount)
blogRouter.get("/sort", controller.sort)
blogRouter.get("/ownersBlog/:id",auth.ensureLogin, controller.readOwnersBlog)
blogRouter.get("/readBlog/:id",middleware.findBlogFromCache, controller.readBlog)


module.exports = blogRouter