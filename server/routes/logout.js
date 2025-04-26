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
import "dotenv/config";

// To separate the login route
import { Router } from "express";

const logout_router = Router();

logout_router.post("/logout", async (req, res) => {
  console.log("Trying to log out the user!");

  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.json({ message: "Failed to logout" });
    }
    res.clearCookie("userEmail"); // Clear the custom cookie
    res.json({ message: "Logged out successfully" });
  });
});

export default logout_router;
