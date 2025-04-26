import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import pool from "../db.js";
import cors from "cors";
import bcrypt, { hash } from "bcrypt";

// For session and cookie management
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// To separate the login route
import { Router } from "express";

// Fix salting rounds for bcrypt hashing algo
const saltRounds = 12;

const register_router = Router();

// Function to insert new user into DB when they Register
async function Register(uname, upass) {
  // Check for existing user
  const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [
    uname,
  ]);

  if (existingUser.rowCount > 0) {
    return {
      status: false,
      userData: null,
      message: "Email already in Use!, use a different Email",
    };
  }

  // Use bcrypt.hash to actually save into DB
  // Await the hash instead of using a callback
  const hashedPassword = await bcrypt.hash(upass, saltRounds);

  // Since user does not already exist, insert them into DB
  const registration = await pool.query(
    "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
    [uname, hashedPassword]
  );
  console.log("Registered User Details are: ");

  // Get user's full details
  console.log("Newly registered user account is: ");
  const userAccount = registration.rows[0];
  console.log(userAccount);

  // User has been registered in DB or not?
  if (registration.rowCount > 0) {
    return {
      status: true,
      userData: userAccount,
      message: "Account created!",
    };
  } else {
    return { status: false, userData: null, message: "Registration Failed!" };
  }
}

// Path for registration/create new account
register_router.post("/register", async (req, res) => {
  // Use Destructuring
  const { username: reg_username, password: reg_password } = req.body;

  console.log("The registered username is: " + reg_username);
  console.log("The registered password is: " + reg_password);

  try {
    // Call the create acc/register function
    const reg = await Register(reg_username, reg_password);

    if (reg.status) {
      console.log("Registration successfull, DB returned true");
      res.json({
        regStatus: reg.status,
        userData: reg.userData,
        message: reg.message,
      });
    } else {
      console.log("Registration failed, DB returned false");
      console.log(reg.message);

      res.json({
        regStatus: reg.status,
        userData: reg.userData,
        message: reg.message,
      });
    }
  } catch (error) {
    console.error("Registration error:", error.message);
    res.json({ success: false, message: "Internal server error" });
  }
});

export default register_router;
