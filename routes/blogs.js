const express = require("express");
const router  = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");


//INDEX - show all blogs
router.get("/", function(req, res){
    // Get all blogs from DB
    Blog.find({}, function(err, allBlogs){
       if(err){
           console.log(err);
       } else {
          res.render("blogs/index",{blogs: allBlogs});
       }
    });
});

//CREATE - add new blog to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let title = req.body.title;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newBlog = {title: title, image: image, description: desc, author:author}
    // Create a new blog and save to DB
    Blog.create(newBlog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

//NEW - show form to create new blog
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("blogs/new"); 
});

// SHOW - shows more info about one blog
router.get("/:id", function(req, res){
    //find the blog with provided ID
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            console.log(foundBlog)
            //render show template with that blog
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

// EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("blogs/edit", {blog: foundBlog});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkBlogOwnership, function(req, res){
    // find and update the correct blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// DESTROY BLOG ROUTE
router.delete("/:id",middleware.checkBlogOwnership, function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else {
          res.redirect("/blogs");
      }
   });
});


module.exports = router;

