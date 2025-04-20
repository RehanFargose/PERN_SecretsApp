import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
// To send data between pages
import { useNavigate } from "react-router-dom";

export default function LoginPage(props) {
  // api url from .env
  // vite has separate way to import env variables
  const API_URL = import.meta.env.VITE_API_URL;

  // useState to handle the login details
  const [loginInfo, setLogin] = useState({
    username: "",
    password: "",
  });

  // To handle change in input
  function handleChange(event) {
    // Destructure the info
    // name refers to name of field being edited
    // value refers to the value entered
    const { name, value } = event.target;

    // console.log("Input field being edited currently is: "+name);
    // console.log("Input value of current field is: "+value);

    setLogin((prevInfo) => {
      // Spread unchanged value as is
      // Update edited field to new value
      return { ...prevInfo, [name]: value };
    });
  }

  // To pass data to other pages
  const navigate = useNavigate();

  // Send login details to backend when submit button is pressed
  async function sendLoginDetails(event) {
    try {
      // Call the api endpt for login and send the entered details
      const response = await axios.post(API_URL + "/login", loginInfo);

      // Extract and store the boolean val returned from the backend server
      const loginStatus = response.data.loginStatus;
      console.log("The boolean returned for login is: " + loginStatus);

      // Extract the User's data sent back by DB
      // console.log("Received user credentials are: ");
      const userData = response.data.userData;
      // console.log(userData);

      // console.log("Received user secret is: ");
      // const userSecret = userData.secret;
      // console.log(userSecret);

      // Clear the input fields
      setLogin({
        username: "",
        password: "",
      });

      // Navigate to certain pages based on returned boolean variable
      if (loginStatus) {
        // Redirect to secrets page
        navigate("/secrets", { state: { userDetails: userData } });
      } else {
        alert("Login failed! Please check your credentials.");
        console.log("Redirecting to Login Page");
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  }

  return (
    <>
      <div className="page-container">
        <Header />

        <div className="container mt-5">
          <h1>Login</h1>

          <div className="row">
            <div className="col-sm-8">
              <div className="card">
                <div className="card-body">
                  {/* <!-- Makes POST request to /login route --> */}
                  <form>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={loginInfo.username}
                        onChange={handleChange}
                        name="username"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={loginInfo.password}
                        onChange={handleChange}
                        name="password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-dark"
                      onClick={(event) => {
                        event.preventDefault();

                        sendLoginDetails();
                      }}
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* <!-- <div className="col-sm-4">
                <div className="card">
                    <div className="card-body">
                    <a className="btn btn-block" href="/auth/google" role="button">
                        <i className="fab fa-google"></i>
                        Sign In with Google
                    </a>
                    </div>
                </div>
                </div> --> */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
