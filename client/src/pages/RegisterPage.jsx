import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
// To send data between pages
import { useNavigate } from "react-router-dom";

export default function RegisterPage(props) {
  // api url from .env
  // vite has separate way to import env variables
  const API_URL = import.meta.env.VITE_API_URL;

  // UseState to store entered data
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    // console.log("The field being edited is: " + name);
    // console.log("The value entered in field is: " + value);

    setNewAccount((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  }

  // To pass data to other pages
  const navigate = useNavigate();

  // Function to send user details to backend, register them and then redirect to a new page
  async function registerUser(event) {
    // const { username, password } = event.target;
    try {
      const response = await axios.post(
        "http://localhost:3000" + "/register",
        newAccount
      );

      // Get the boolean value, used for nav
      const regStatus = response.data.regStatus;

      // Get the user Account details, passed when navigating
      const userData = response.data.userData;

      // Get the message sent back from server, to be used as alerts/notifications
      const message = response.data.message;

      // Clear the input fields
      setNewAccount({
        username: "",
        password: "",
      });

      // Navigation condition
      if (regStatus) {
        alert(message);
        // Pass the user details to the secrets page
        navigate("/secrets", { state: { userDetails: userData } });
      } else {
        // alert("Registration failed, Email already exists!");
        alert(message);
        navigate("/register");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <>
      <div className="page-container">
        <Header />

        <div className="content-wrapper">
          <div className="container mt-5">
            <h1>Register</h1>

            <div className="row">
              <div className="col-sm-8">
                <div className="card">
                  <div className="card-body">
                    {/* <!-- Makes POST request to /register route --> */}
                    <form>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="username"
                          value={newAccount.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={newAccount.password}
                          onChange={handleChange}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-dark"
                        onClick={(event) => {
                          event.preventDefault();

                          registerUser();
                        }}
                      >
                        Register
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* <!-- <div className="col-sm-4">
                <div className="card social-block">
                    <div className="card-body">
                    <a className="btn btn-block" href="/auth/google" role="button">
                        <i className="fab fa-google"></i>
                        Sign Up with Google
                    </a>
                    </div>
                </div>
                </div> --> */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
