import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import pool from "./db.js";
import cors from "cors";
import bcrypt, { hash } from "bcrypt";
import "dotenv/config";
// For session and cookie management
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Import routes
import login_router from "./routes/login.js";
import register_router from "./routes/register.js";
import logout_router from "./routes/logout.js";
import secrets_router from "./routes/secrets.js";
import home_router from "./routes/home.js";
// Create server
const app = express();
const port = 3000;

// To manage cookies and parse/read them
app.use(cookieParser());

// To read info sent via form
app.use(bodyParser.urlencoded({ extended: true }));

// Handling static files like images and css
app.use(express.static("public"));

// To parse json
app.use(express.json());

// To parse cookies
app.use(cookieParser());

// Use cors to allow other servers such as react vite server to send data here via forms
app.use(
  cors({
    // react frontend url
    origin: "http://localhost:5173",
    credentials: true, // allows cookies
  })
);

// express session
app.use(
  session({
    secret: "yourSecretKey", // change this to something secure in production
    resave: false,
    saveUninitialized: false,
    // To set cookies
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      secure: false, // true if HTTPS
      sameSite: "Lax", // or 'None' if cross-origin
    },
  })
);

// Use passport for managing sessions
app.use(passport.initialize());
app.use(passport.session());

// Use the imported route

// Home route for cookie trial
app.use(home_router);

// Route to handle user creds sent via register form
app.use(register_router);

// Route for Login
app.use(login_router);

// Route to get secrets
app.use(secrets_router);

// Route to logout from the session
app.use(logout_router);

// Start the server on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
