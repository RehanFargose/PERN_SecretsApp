import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header(props) {
  // To navigate via react router
  const navigate = useNavigate();

  // Function to logout/deserialize user from the session
  async function userLogout(event) {
    alert("Trying to Log out the user!");
    navigate("/");
    console.log("User Logged Out!");
  }

  return (
    <>
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <Link
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <svg className="bi me-2" width="40" height="32" aria-hidden="true">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="fs-4">Secrets App</span>
        </Link>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link to="/" className="nav-link active" aria-current="page">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Features
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              About
            </Link>
          </li>

          {/* {props.loginStatus ? (
            <>
              <li className="nav-item">
                <button type="button" className="btn btn-danger">
                  Logout
                </button>
              </li>
            </>
          ) : null} */}

          {/* Display Logout button only when you are on secrets page */}
          {props.loginStatus && (
            <>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(event) => {
                    // To prevent page refresh and erroneous behaviour
                    event.preventDefault();

                    // Logout user and send back to home page
                    userLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </header>
    </>
  );
}
