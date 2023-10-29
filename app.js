const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./users/user.route");
const blogRoute = require("./blogs/blog.route");
const cookieParser = require("cookie-parser");
const auth = require("./authentication/auth");
const blogModel = require("./models/blog");

const app = express();

app.locals.siteBrand ="infotek";

app.set("view engine", "ejs");
app.set("views", "views");

app.locals.siteName = "Liberator";
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use("/users", userRoute);
app.use("/blogs", blogRoute);
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res
    .status(200)
    .render("welcome", { navs: ["Signup","Login","Dashboard"] });
});
app.get("/home", (req, res) => {
  res
    .status(200)
    .render("welcome", { navs: ["Signup","Login","Dashboard"] });
});

app.get("/signup", (req, res) => {
  res.status(200).render("signup", { navs: ["Login"] });
});

app.get("/login", (req, res) => {
  res.status(200).render("login", { navs: ["Signup", "Logout"] });
});



// Getting of blogs by logged in and not logged in users (paginated).
app.get("/published_blogs", async (req, res) => {
  const page = req.query.page || 0;
  const blogPerPage = 20;

  const allPublishedBlogsInfo = await blogModel
    .find({ state: "published" })
    .sort({ published_timestamp: "desc" });

  const paginatedBlogs = await blogModel
    .find({ state: "published" })
    .sort({ published_timestamp: "desc" })
    .skip(page * blogPerPage)
    .limit(blogPerPage);

  const maxPage = Math.round(allPublishedBlogsInfo.length / blogPerPage);
  const skip = page * blogPerPage;
  const allPages = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  res.status(200).render("publishedBlogs", {
    navs: ["Dashboard", "Signup", "Login"],
    paginatedBlogs,
    maxPage,
    allPages,
    skip,
    date: new Date(),
  });
});


// Getting to the dashboard of logged in users to view created blogs(published and draft)
app.get("/dashboard", auth.ensureLogin, async (req, res) => {
  const page = req.query.page || 0;
  const blogPerPage = 20;

  const allDarshboardBlogs = await blogModel
    .find({ user_id: res.locals.user._id })
    .sort({ drafted_timestamp: "desc" });

  const paginatedBlogs = await blogModel
    .find({ user_id: res.locals.user._id })
    .sort({ drafted_timestamp: "desc" })
    .skip(page * blogPerPage)
    .limit(blogPerPage);

  const maxPage = Math.round(allDarshboardBlogs.length / blogPerPage);
  const skip = page * blogPerPage;
  const allPages = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  res.status(200).render("myDraftedBlogs", {
    navs: ["Published_blogs", "Create_blog", "Logout"],
    paginatedBlogs,
    maxPage,
    skip,
    allPages,
    date: new Date(),
    user: res.locals.user,
  });
});


// Filtering of the blogs of logged in user by state (paginated)
app.get("/dashboard/filter", auth.ensureLogin, async (req, res) => {
  const selector = req.query;

  if (selector.filter === "draft") {
    const page = req.query.page || 0;
    const blogPerPage = 20;

    const allDarshboardDraftBlogs = await blogModel
      .find({ user_id: res.locals.user._id, state: "draft" })
      .sort({ drafted_timestamp: "desc" });

    const paginatedBlogs = await blogModel
      .find({ user_id: res.locals.user._id, state: "draft" })
      .sort({ drafted_timestamp: "desc" })
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    const maxPage = Math.round(allDarshboardDraftBlogs.length / blogPerPage);
    const skip = page * blogPerPage;
    const allPages = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    res.status(200).render("blogsByDraft", {
      navs: ["Published_blogs", "Create_blog", "Logout"],
      paginatedBlogs,
      maxPage,
      skip,
      allPages,
      date: new Date(),
      user: res.locals.user,
    });
  } else if (selector.filter === "published") {
    const page = req.query.page || 0;
    const blogPerPage = 20;

    const darshboardPublishedBlogs = await blogModel
      .find({ state: "published", user_id: res.locals.user._id })
      .sort({ drafted_timestamp: "desc" });

    const paginatedBlogs = await blogModel
      .find({ state: "published", user_id: res.locals.user._id })
      .sort({ drafted_timestamp: "desc" })
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    const maxPage = Math.round(darshboardPublishedBlogs.length / blogPerPage);
    const skip = page * blogPerPage;
    const allPages = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    res.status(200).render("blogsByPublished", {
      navs: ["Published_blogs", "Create_blog", "Logout"],
      paginatedBlogs,
      maxPage,
      skip,
      allPages,
      date: new Date(),
      user: res.locals.user,
    });

  } else if (selector.filter === "All") {
    const page = req.query.page || 0;
    const blogPerPage = 20;

    const darshboardBlogs = await blogModel
      .find({user_id: res.locals.user._id })
      .sort({ drafted_timestamp: "desc" });

    const paginatedBlogs = await blogModel
      .find({user_id: res.locals.user._id })
      .sort({ drafted_timestamp: "desc" })
      .skip(page * blogPerPage)
      .limit(blogPerPage);

    const maxPage = Math.round(darshboardBlogs.length / blogPerPage);
    const skip = page * blogPerPage;
    const allPages = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    
    res.status(200).render("myDraftedBlogs", {
      navs: ["Published_blogs", "Create_blog", "Logout"],
      paginatedBlogs,
      maxPage,
      skip,
      allPages,
      date: new Date(),
      user: res.locals.user,
    });
  } else {
    res.render("pageNotFound", { navs: ["Dashboard"] });
  }
});



// Filtering all published blogs by author, tag and title (paginated)
app.get("/published_blogs/filter", async (req, res) => {
  const selector = req.query;

  if (selector.filter === "author") {
    try {
      let contentUpperCase = selector.content.toUpperCase();
      const page = req.query.page || 0;
      const blogPerPage = 20;

      const allPublishedBlogsInfo = await blogModel
        .find({ author: contentUpperCase, state: "published" })
        .sort({ published_timestamp: "desc" });

      const blogsByAuthorInfo = await blogModel
        .find({ author: contentUpperCase, state: "published" })
        .sort({ published_timestamp: "desc" })
        .skip(page * blogPerPage)
        .limit(blogPerPage);

        const maxPage = Math.round(allPublishedBlogsInfo.length / blogPerPage);
        const skip = page * blogPerPage;
        const allPages = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20,
        ];
  
        res.status(200).render("blogsByAuthor", {
          navs: ["Published_blogs", "Create_blog", "Logout"],
          blogsByAuthorInfo,
          maxPage,
          skip,
          allPages,
          name: selector.content,
          date: new Date(),
        });
      

    } catch (err) {
      res.render("pageNotFound");
      console.log(err.message);
    }
  } else if (selector.filter === "title") {
    try {
      let contentUpperCase = selector.content.toUpperCase();

      const blogsByTitleInfo = await blogModel
        .find({ title: contentUpperCase, state: "published" })
        .sort({ published_timestamp: "desc" });

      res.status(200).render("blogsByTitle", {
        navs: ["Published_blogs", "Create_blog", "Logout"],
        blogsByTitleInfo,
        date: new Date(),
      });
    } catch (err) {
      res.render("pageNotFound");
    
    }
  } else if (selector.filter === "tag") {
    try {
      let contentUpperCase = selector.content.toUpperCase();
      const page = req.query.page || 0;
      const blogPerPage = 3;

      const allPublishedBlogsInfo = await blogModel
        .find({ state: "published", tag: contentUpperCase })
        .sort({ published_timestamp: "desc" });

      const blogsByTagInfo = await blogModel
        .find({ tag: contentUpperCase, state: "published" })
        .sort({ published_timestamp: "desc" })
        .skip(page * blogPerPage)
        .limit(blogPerPage);

      const maxPage = Math.round(allPublishedBlogsInfo.length / blogPerPage);
      const skip = page * blogPerPage;
      const allPages = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20,
      ];
      res.status(200).render("blogsByTag", {
        navs: ["Published_blogs", "Create_blog", "Logout"],
        blogsByTagInfo,
        maxPage,
        skip,
        allPages,
        tag: selector.content,
        date: new Date(),
      });
    } catch (err) {
      res.render("pageNotFound");
  
    }
  } else {
    res.render("pageNotFound", { navs: ["Published_blogs"] });
  }
});


// Getting to the blog creation page
app.get("/create_blog", auth.ensureLogin, (req, res) => {
  res.status(200).render("createBlog", {
    navs: ["Dashboard","Logout"],
    date: new Date(),
  });
});


// Getting to the blog update page
app.get("/updateBody", auth.ensureLogin, async (req, res) => {
  const page = req.query.page || 0;
  const blogPerPage = 3;
  const myDraftedBlogsInfo = await blogModel
    .find({ user_id: res.locals.user._id })
    .sort({ drafted_timestamp: "desc" })
    .skip(page * blogPerPage)
    .limit(blogPerPage);
  res.status(200).render("updateBody", {
    navs: ["Logout"],
    myDraftedBlogsInfo,
    date: new Date(),
  });
});


// Getting to the error pages
app.get("/existingUser", (req, res) => {
  res.status(409).render("existingUser", {
    navs: ["Signup", "Login"],
  });
});

app.get("/userNotFound", (req, res) => {
  res.status(404).render("userNotFound", {
    navs: ["Signup", "Login"],
  });
});

app.get("/invalidInfo", (req, res) => {
  res.status(422).render("invalidInfo", {
    navs: ["Login", "Signup"],
  });
});

app.get("/credentialsRequired", (req, res) => {
  res.status(400).render("credentialsError", {
    navs: ["Login", "Signup"],
  });
});

app.get("/serverError", (req, res) => {
  res.status(500).render("serverErrror", {
    navs: ["Login", "Signup"],
  });
});


// logging out
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});


// Handling non-existing route
app.get("*", (req, res) => {
  res.status(404).render("pageNotFound", { navs: ["Home"] });
});


// Global error handling
app.use((err, req, res, next) => {
  res.render("serverError", {
    navs: ["Home", "Published_blogs", "Dashboard"],
    err:err.message
  })
})

module.exports = app;
