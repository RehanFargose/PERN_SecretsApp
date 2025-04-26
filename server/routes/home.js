import express, { response } from "express";
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

const home_router = Router();

// Set basic cookies
home_router.get("/", async (req, res) => {
  res.cookie("hello", "world", { maxAge: 60000 * 60 * 2 });

  // Always send some message back via .send or .json to complete the cycle and have the cookies sent over saved
  // res.send("Cookie has been set successfully!"); // <-- THIS!
  res.json({ message: "Cookie set!" });
});

export default home_router;
