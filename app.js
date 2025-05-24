const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const Usermodel = require("./model/usermodel");
const BatchModel = require("./model/batchmodel");
const postmodel = require("./model/postmodel");
const Tokenmodel = require("./model/Tokenmodel");
const Message = require('./model/message');
const Suggestion = require("./model/Suggestion");
require('dotenv').config();
const ejs = require("ejs");
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require("fs");
const uuid = require("uuid").v4();
const { GridFSBucket } = require('mongodb');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const flash = require("connect-flash");
const crypto = require("crypto");
const { error } = require('console');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;
const compression = require('compression');
const { reverse } = require('dns');
const axios = require("axios");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const postRoutes = require("./routes/postRoutes");
const suggestionRoutes = require('./routes/suggestionRoutes');
const profileRoutes = require("./routes/profileRoutes");
const batchRoutes = require("./routes/batchRoutes");
const studentRoutes = require("./routes/studentRoutes");
const connectionRoutes = require("./routes/connectRoutes");
const messageRoutes = require("./routes/messageRoutes");
const isAuth = require("./middleware/isAuth.js");
const upload = require("./utils/upload.js");
const likeRoutes = require("./routes/likeRoutes");
const searchRoutes = require('./routes/homeRoutes');
const editPostRoutes = require('./routes/posteditRoutes');
const deletePostRoutes = require('./routes/postdeleteRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require('./routes/eventRoute');
const manageusersRoute = require('./routes/manageusersRoute');
const managepostsRoute = require('./routes/managepostRoute')
const reportRoutes = require('./routes/reportsRoutes.js');
const viewplacementRoute = require('./routes/viewplacementRoute');
const viewinternshipRoute = require('./routes/internshipRoutes.js');
const placementRoutes = require('./routes/placementRoutes');
const { isAdmin } = require('./middleware/isAdmin');
const feedback = require("./model/feedbackmodel")

 
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET;

 
if (process.env.NODE_ENV === "production") {
  app.set('trust proxy', 1);
}

 
const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('MongoDB session store error:', error);
});

 
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected '))
  .catch(err => console.error('MongoDB Connection Error:', err));
 
// Middleware
app.use(cookieParser());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: sessionSecret,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production", 
    httpOnly: false,         
    sameSite: "strict",     
    maxAge: 1000 * 60 * 60, 
  }
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.use(compression());
app.use(methodOverride('_method'));
// Define your routes after this


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Input validation middleware
const validateInput = [
  body('username').trim().escape().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(" Server Error:", err);
//   res.status(500).send("Something went wrong! Please try again.");
// });


app.get("/", (req, res) => {
  res.redirect("/register");
});

app.use(async (req, res, next) => {
  if (req.session.user) {
    await Usermodel.findByIdAndUpdate(req.session.user._id, { lastActive: Date.now() });
  }
  next();
});


// Use Auth Routes
app.post("/register",)


app.use("/", authRoutes);
app.use("/", homeRoutes);
app.use("/", uploadRoutes);
app.use("/", postRoutes);
app.use("/", suggestionRoutes);
app.use("/profile", profileRoutes);
app.use('/admin', adminRoutes);
app.use('/',adminRoutes);

app.use(batchRoutes);
app.use(studentRoutes);
app.use(connectionRoutes);

// Use separated routes
app.use("/", reportRoutes);
app.use("/", messageRoutes);
app.use(likeRoutes);
app.use('/', searchRoutes);
app.use('/', editPostRoutes);
app.use('/', deletePostRoutes);

app.use('/', eventRoutes);
app.use('/', manageusersRoute);
app.use('/', managepostsRoute);
app.use('/', reportRoutes);
app.use('/', viewplacementRoute);
app.use('/', viewinternshipRoute);
app.use('/', placementRoutes);
app.use('/', suggestionRoutes);







// // 500 Error Handler (already partially done)
// app.use((err, req, res, next) => {
//   console.error("Internal Server Error:", err);
//   res.status(500).render("500"); // views/500.ejs
// });

 
 

app.listen(port, () => {
  console.log(`Server is running on  ${process.env.FRONTEND_URL}`);
});
