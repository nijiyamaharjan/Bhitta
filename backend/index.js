require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const fileupload = require("express-fileupload");
const passport = require("./middlewares/passport");

const { blogsRouter } = require("./routes/blog");
const errorHandler = require("./middlewares/errorHandler");

const connectDB = require("./db/connect");

app.use(express.json());

const authRouter = require("./routes/auth");
const { viewRouter, modifyRouter } = require("./routes/blog");
const authenticate = require("./middlewares/authenticate");
const userRouter = require("./routes/users");
const imageRouter = require("./routes/image");

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.get("/hello", async (req, res, next) => res.send("hi!"));

app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (adjust as needed)
    },
  })
);

// setuppassport

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter, viewRouter, userRouter, imageRouter);
app.use("/", authenticate, modifyRouter);
app.use("/", errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log("listening on port " + process.env.PORT);
    });
  } catch (errr) {
    console.log(errr);
  }
};
start();
