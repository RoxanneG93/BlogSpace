const express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");
    // seedDB      = require("./seeds");

// requiring routes
const commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes      = require("./routes/index");

// connecting to mongoDB
mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Passport Config
app.use(require("express-session")({
    secret: "Bangtan",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.listen(8080, () => {
    console.log("Blog App is running on 8080!");
});
