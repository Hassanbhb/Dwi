//check if env is production or not
if (process.env.NODE_ENV !== "production") {
  // require dotenv if development env
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

//require passoprt config
require("./config/passport")(passport);

//import routers
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/authentication/login");
const registerRouter = require("./routes/authentication/register");
const logoutRouter = require("./routes/authentication/logout");
const dashboardRouter = require("./routes/dashboard/dashboard");
const profileRouter = require("./routes/profile/profile");

const app = express();

app.use(helmet());

//set template engine
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  })
);

//connect flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.errors = req.flash("error");
  res.locals.successes = req.flash("success");
  next();
});

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", error => console.log("connected to db..."));

//use routes
app.use("/", indexRouter);
app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", logoutRouter);
app.use("/dashboard", dashboardRouter);
app.use("/", profileRouter);
//catch unexisting routes
app.use(function(req, res, next) {
  // create a page to handle this case
  res.status(404).send("This page does not exist");
});

app.listen(process.env.PORT || 3000, () => console.log("Server Running..."));
