import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import pool from "../db.js";
import cors from "cors";
import bcrypt, { hash } from "bcrypt";
import "dotenv/config";

// For session and cookie management
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// To separate the login route
import { Router } from "express";

// Route config
const login_router = Router();

// Function to login user by checking if entered details exist in the db
async function Login(uname, upass) {
  // Query to check/match if user details exist in the db, to log them in
  const user_login = await pool.query("SELECT * FROM users WHERE email=$1;", [
    uname,
  ]);
  // console.log(user_login.rows);

  // Account exists, now go ahead with verifying hashed password
  if (user_login.rowCount > 0) {
    // uname and upass are user entered text info
    // 1st retrieve the hashed password saved in DB to later compare it with user entered pw
    const getHash = await pool.query(
      "SELECT password FROM users WHERE email=$1",
      [uname]
    );

    // Extract password from the query
    const hashedPass = getHash.rows[0].password;
    console.log("The hashed password is: ");
    console.log(hashedPass);

    // Compare entered pass and hashed pass using bcrypt can use promise or await for db connection with bcrpyt
    // await is more convenient while promise is more verbose
    const isPasswordMatch = await bcrypt.compare(upass, hashedPass);

    // isPasswordMatch is the new boolean
    if (isPasswordMatch) {
      // Store the account details in a const
      const userAccount = user_login.rows[0];

      // Send data back to user
      return {
        status: true,
        userData: userAccount,
        message: "Login Success, Passwords Matched!",
      };
    } else {
      return {
        status: false,
        userData: null,
        message: "Incorrect Password!",
      };
    }
  } else {
    // User account does not exist, return false to frontend
    console.log("User does not exist, cannot Login, redirecting to Home Page");
    return { status: false, userData: null, message: "User does not exist" };
  }
}

// Router for Login form
login_router.post("/login", async (req, res) => {
  // var login_username = req.body.username;
  // var login_password = req.body.password;

  // Use Destructuring instead
  const { username: login_username, password: login_password } = req.body;

  console.log("The entered login username is: " + login_username);
  console.log("The entered login password is: " + login_password);

  // Since React handles routing, we just need to return a true/false to react frontend to decide on routing
  try {
    // Put DB query function here to check for errors
    const logging_user = await Login(login_username, login_password);

    if (logging_user.status) {
      console.log("Login successfull, DB returned true");

      // Set session details
      req.session.userID = logging_user.userData.id;
      req.session.username = logging_user.userData.email;
      // req.session.password = logging_user.userData.password;

      // Set cookies
      res.cookie("userEmail", logging_user.userData.email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        maxAge: 1000 * 60 * 60 * 24, // Cookie expires in 24 hours
      });

      // Send data to website
      res.json({
        loginStatus: logging_user.status,
        userData: logging_user.userData,
        message: logging_user.message,
      });
    } else {
      console.log("Login failed, DB returned false");
      res.json({
        loginStatus: logging_user.status,
        userData: logging_user.userData,
        message: logging_user.message,
      });
    }
  } catch (error) {
    // console.error("Login error:", error.message);
    // res.status(500).json({ success: false, message: "Internal server error" });
    if (error.response && error.response.status === 401) {
      alert("Unauthorized: Incorrect username or password.");
      navigate("/");
    } else {
      console.error("Unexpected error:", error.message);
    }
  }
});

export default login_router;
