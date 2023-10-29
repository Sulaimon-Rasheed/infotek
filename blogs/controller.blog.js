const blogModel = require("../models/blog");
const logger = require('../logger');


// Service function for Blog creation
const createBlog = async (
    {
         title, 
         description,
         author,
         state,
         read_count,
         reading_time,
         tag,
         body,
         drafted_timestamp,
         published_timestamp,
         user_id
    }
    ) => {
  const blogInfo = {
    title, 
    description,
    author,
    state,
    read_count,
    reading_time,
    tag,
    body,
    drafted_timestamp,
    published_timestamp,
    user_id
};
logger.info('[CreateBlog] => Starting blog creation')
  if (!blogInfo) {
    return {
      message: "invalid info.",
      code: 422,
    };
  }

  const blog = await blogModel.create(blogInfo);
  logger.info('[CreateBlog] => Blog successfully created as a draft')
  return {
    message: "Blog successfully created",
    code: 200,
    blog,
  };
};

//Updating the state of blogs
const updateState = (req, res) => {
  const id = req.params.id
  const update = req.body
  update.published_timestamp = new Date()
  blogModel.findByIdAndUpdate(id,{state:update.state, published_timestamp:update.published_timestamp} , { new: true })
      .then(newState => {
        res.redirect("/dashboard")
      }).catch(err => {
          console.log(err)
          res.status(500).send(err)
      })
};


//Updating the body of blogs
const updateBody = (req, res) => {
  const id = req.params.id
  const update = req.body
   let updateArray = update.body.split(" ")
   let count = 0
   updateArray.forEach(word=>{
    count++
   })
   let blogWordsCount = count
   update.reading_time = blogWordsCount / 200
  blogModel.findByIdAndUpdate(id, {body:update.body,reading_time:`${update.reading_time} min`}, { new: true })
      .then(newState => {
        res.redirect("/dashboard")
      }).catch(err => {
          console.log(err)
          res.status(500).send(err)
      })
};


// Deleting of blogs
const deleteBlog = (req, res) => {
  const id = req.params.id
  blogModel.findByIdAndRemove(id)
      .then(blog => {
          res.redirect("/dashboard")
      }).catch(err => {
          console.log(err)
          res.status(500).send(err)
      })
}


// Read counting of blogs
const readCount = async (req,res)=>{
const id = req.params.id
const update = req.body.readCount
await blogModel.findByIdAndUpdate(id, {read_count:update})
res.redirect("/published_blogs")
}


// Sorting of blogs by read_count or reading_time or timestamp
const sort = async (req,res)=>{
  if(req.query.sort === "read_count"){
    const page = req.query.page || 0
    const blogPerPage = 20

    const allPublishedBlogsInfo = await blogModel
    .find({state:"published"})
    .sort({read_count:"desc"})

    const blogs = await blogModel
    .find({state:"published"})
    .sort({read_count:"desc"})
    .skip(page * blogPerPage)
    .limit(blogPerPage)

    const maxPage = Math.round(allPublishedBlogsInfo.length/blogPerPage) 
    const skip = page * blogPerPage
    const allPages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    res.render("orderByReadCount", {navs:["published_blogs", "Dashboard", "Logout"], blogs,maxPage, skip, allPages, sortType:req.query.sort, date:new Date()
    })
    }else if(req.query.sort === "timestamp"){
      const page = req.query.page || 0
    const blogPerPage = 20

    const allPublishedBlogsInfo = await blogModel
    .find({state:"published"})
    .sort({published_timestamp:"desc"})

    const blogs = await blogModel
    .find({state:"published"})
    .sort({published_timestamp:"desc"})
    .skip(page * blogPerPage)
    .limit(blogPerPage)

    const maxPage = Math.round(allPublishedBlogsInfo.length/blogPerPage) 
    const skip = page * blogPerPage
    const allPages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      res.render("orderByTimestamp", {navs:["published_blogs", "Dashboard", "Logout"], blogs,maxPage,skip,allPages,sortType:req.query.sort, date:new Date()
      })
    }else if(req.query.sort === "reading_time"){
      const page = req.query.page || 0
      const blogPerPage = 20
  
      const allPublishedBlogsInfo = await blogModel
      .find({state:"published"})
      .sort({reading_time:"desc"})
  
      const blogs = await blogModel
      .find({state:"published"})
      .sort({reading_time:"desc"})
      .skip(page * blogPerPage)
      .limit(blogPerPage)
  
      const maxPage = Math.round(allPublishedBlogsInfo.length/blogPerPage) 
      const skip = page * blogPerPage
      const allPages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      res.render("orderByReadingTime", {navs:["published_blogs", "Dashboard", "Logout"], blogs,maxPage, skip,allPages,sortType:req.query.sort, date:new Date()
      })
    }else{
      res.render("pageNotFound",{navs:["published_blogs", "Guide"]})
    }
  }



  // Geting the full text of dashboard blogs of logged in users only
  const readOwnersBlog = async (req,res)=>{
    const id = req.query.blogId
    const blog = await blogModel.findOne({_id:id})
    res.render("ownersBlog",{
      navs:["Dashboard", "Logout"],
       blog
    })
  }


  //Getting the full text of published blogs visible to both logged in and not loggged in users
  const readBlog = async (req,res)=>{
    const id = req.query.blogId
    const blog = await blogModel.findOne({_id:id})
    res.render("singleBlog",{
       blog
    })
  }


module.exports = { 
  createBlog, 
  updateState, 
  deleteBlog, 
  updateBody,
  readCount,
  sort,
  readOwnersBlog,
  readBlog
};
