import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import pool from "./db.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json()); // <-- this is crucial for parsing JSON bodies
app.use(cors());

// Function to insert new user into DB when they Register
async function Register(uname, upass) {
  // Check for existing user
  const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [
    uname,
  ]);

  if (existingUser.rowCount > 0) {
    return { status: false, userData: null };
  }

  // If user does not already exist, insert them into DB
  const registration = await pool.query(
    "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
    [uname, upass]
  );
  console.log("Registered User Details are: ");

  // Get user's full details
  console.log("Newly registered user account is: ");
  const userAccount = registration.rows[0];
  console.log(userAccount);

  // Use has been registered in DB or not?
  if (registration.rowCount > 0) {
    return { status: true, userData: userAccount };
  } else {
    return { status: false, userData: null };
  }
}

// Route to handle user creds sent via register form
app.post("/register", async (req, res) => {
  // var reg_username = req.body.username;
  // var reg_password = req.body.password;

  // Use Destructuring instead
  const { username: reg_username, password: reg_password } = req.body;

  console.log("The registered username is: " + reg_username);
  console.log("The registered password is: " + reg_password);

  try {
    // Call the create acc/register function
    const reg = await Register(reg_username, reg_password);

    if (reg.status) {
      console.log("Registration successfull, DB returned true");
      res.json({ regStatus: reg.status, userData: reg.userData });
    } else {
      console.log("Registration failed, DB returned false");
      res.json({ regStatus: reg.status, userData: reg.userData });
    }
  } catch (error) {
    console.error("Registration error:", error.message);
    res.json({ success: false, message: "Internal server error" });
  }
});

// Function to login user by checking if entered details exist in the db
async function Login(uname, upass) {
  // Query to check/match if user details exist in the db, to log them in
  const user_login = await pool.query(
    "SELECT * FROM users WHERE email=$1 AND password=$2;",
    [uname, upass]
  );
  console.log(user_login.rows);

  // Store the returned value in a variable
  const userAccount = user_login.rows[0];

  // If a record is returned this means there is a perfect match and a user exists,
  // thus log them in by passing a true value to the route for redirecting
  if (user_login.rows.length > 0) {
    console.log("User Account exists");
    // Also return user details to render custom login page
    return { status: true, userData: userAccount };
    // return true;
  } else {
    console.log(
      "Incorrect/User does not exist, cannot Login, redirecting to Home Page"
    );
    return { status: false, userData: null };
  }
}

// Route to handle user creds sent via login form
app.post("/login", async (req, res) => {
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
      res.json({
        loginStatus: logging_user.status,
        userData: logging_user.userData,
      });
    } else {
      console.log("Login failed, DB returned false");
      res.json({
        loginStatus: logging_user.status,
        userData: logging_user.userData,
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
