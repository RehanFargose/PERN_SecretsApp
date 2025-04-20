import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";

// To send data between pages
import { useNavigate } from "react-router-dom";

export default function HomePage(props) {
  // To pass data to other pages
  const navigate = useNavigate();

  return (
    <>
      <div className="page-container">
        <Header />

        <div className="jumbotron centered">
          <div className="container">
            <i className="fas fa-key fa-6x"></i>
            <h1 className="display-3">Secrets</h1>
            <p className="lead">
              Don't keep your secrets, share them anonymously!
            </p>
            <hr />
            {/* <a className="btn btn-light btn-lg" role="button">Register</a> */}
            <Link to="/register" className="btn btn-light btn-lg">
              Register
            </Link>

            {/* <a className="btn btn-dark btn-lg"  role="button">Login</a> */}
            <Link to="/login" className="btn btn-dark btn-lg">
              Login
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
