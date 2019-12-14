//check if env is production or not
if (process.env.NODE_ENV !== "production") {
  // require dotenv if development env
  require("dotenv").config();
}

const express = require("express");
const helmet = require("helmet");

const app = express();

app.use(helmet());

const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
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
const controleRouter = require("./routes/controle/contorle");

//set template engine
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", error => console.log("connected to db..."));

//session
app.use(
  session({
    // session expires in 12 houres
    cookie: { maxAge: 60000 * 60 * 12 },
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//use routes
app.use("/", indexRouter);
app.use("/auth", loginRouter);
app.use("/auth", registerRouter);
app.use("/", logoutRouter);
app.use("/dashboard", dashboardRouter);
app.use("/", profileRouter);
app.use("/controle", controleRouter);
//catch unexisting routes
app.use(function(req, res, next) {
  // create a page to handle this case
  res.status(404).send("This page does not exist");
});

app.listen(process.env.PORT || 3000, () => console.log("Server Running..."));
