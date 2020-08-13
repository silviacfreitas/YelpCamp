var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
	Campground     = require("./models/campground"),
	seedDB         = require("./seeds.js"),
	Comment        = require("./models/comment"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	User           = require("./models/user"),
	methodOverride = require("method-override")

//Require Routes
var campgroundRoutes  = require("./routes/campgrounds.js"),
	commentRoutes     = require("./routes/comments.js"),
	indexRoutes        = require("./routes/index.js")


mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the DB
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Nina Simone is the prittiest cat ever!",
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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// app.listen(3000, function() { 
// 	console.log('The YelpCamp Server has started!'); 
// });

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
