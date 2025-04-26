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

const secrets_router = Router();

// async function getSecrets(current_user) {
//   // Get list of secrets of other users and not current user
//   const response = await pool.query("SELECT secret from users WHERE id!=$1", [
//     current_user,
//   ]);

//   // If secrets present tranform into a plane array by filtering
//   if (response.rowCount > 0) {
//     const secretsList = response.rows;

//     // Filter down the list into just secrets, turn from obj/dict into array
//     let filteredSecrets = secretsList
//       // Avoid any null elems
//       .filter((item) => item.secret !== null)
//       // Add actual secrets
//       .map((elem, index) => {
//         return elem.secret;
//       });

//     console.log("Only Secrets list is: ");
//     console.log(filteredSecrets);

//     return filteredSecrets;
//   } else {
//     console.log("No Secrets found!");
//   }
// }

// // Path/Endpoint for secrets
// secrets_router.get("/secrets/:id", async (req, res) => {
//   const current_user_ID = req.params.id;
//   console.log("The current user's id is: " + current_user_ID);
//   // Call db query function to retrieve list of secrets
//   try {
//     const UserSecrets = await getSecrets(current_user_ID);
//     // Send back list of secrets as json obj
//     res.json({ UserSecrets });
//   } catch (error) {
//     console.error(error.message);
//   }
// });

async function getSecret(current_user) {
  // Get list of secrets of other users and not current user
  const response = await pool.query(
    "SELECT secret from users WHERE id!=$1 AND secret IS NOT NULL ORDER BY RANDOM() LIMIT 1",
    [current_user]
  );

  // If secrets present tranform into a plane array by filtering
  if (response.rowCount > 0) {
    const random_secret = response.rows[0];

    console.log("1 Random secret is: ");
    console.log(random_secret);

    return random_secret;
  } else {
    console.log("No Secrets found!");
  }
}

// Path/Endpoint for secrets
secrets_router.get("/secrets/:id", async (req, res) => {
  // get the cookies
  console.log("The cookies are: ");
  // console.log(req.headers.cookie);
  console.log(req.cookies);

  // Get user's ID from params
  const current_user_ID = req.params.id;
  console.log("The current user's id is: " + current_user_ID);

  // Call db query function to retrieve list of secrets
  try {
    const randomSecret = await getSecret(current_user_ID);
    // Send back list of secrets as json obj
    res.json(randomSecret);
  } catch (error) {
    console.error(error.message);
  }
});
export default secrets_router;
