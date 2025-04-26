import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// To send data between pages
import { useNavigate } from "react-router-dom";

// React's version of href tag but better and can send data
import { Link } from "react-router-dom";

// To receive data sent via navigate from other pages
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function SecretsPage(props) {
  // api url from .env
  // vite has separate way to import env variables
  const API_URL = import.meta.env.VITE_API_URL;

  // To pass data to other pages
  const navigate = useNavigate();

  // location acts similar to prop, it holds info sent by the previous page
  const location = useLocation();

  const userID = location.state?.userDetails.id;
  const userName = location.state?.userDetails.email;
  const pass = location.state?.userDetails.password;

  // const mySecret = location.state?.userData.secret;
  // To hold user's secret
  const [mySecret, setSecret] = useState();

  // Function to retrieve user's secret
  async function getSecret(event) {
    try {
      // Get a list of secrets from the backend api server
      const response = await axios.get(API_URL + "/secrets/" + userID);

      // To retrieve data via axios do response.data.dictname
      // and not response.rows >> this is used for sql query response not axios response
      const secretsList = response.data.UserSecrets;

      console.log("List of retrieved secrets is: ");

      console.log(secretsList);
    } catch (error) {}
  }

  useEffect(() => {
    // Call function to retrieve secrets from DB
    getSecret();

    // Set state when component mounts
    setSecret(location.state?.userDetails.secret || null);
    console.log("The secret received in new page is:");
    console.log(mySecret);
  }, [location.state?.userData?.secret]);

  return (
    <>
      <div className="page-container">
        <Header loginStatus={true} />

        <div className="jumbotron text-center">
          <div className="container">
            <i className="fas fa-key fa-6x"></i>

            <ol>
              <li>UserID is: {userID}</li>
              <li>Username is: {userName}</li>
              <li>Password is: {pass}</li>
            </ol>

            {/* Use conditional rendering */}
            {mySecret ? (
              <>
                {" "}
                <h1 className="display-3">Your Secret is:</h1>
                <p className="secret-text">{mySecret}</p>
              </>
            ) : (
              <>
                <h1 className="display-3">No Secret available</h1>
                <p className="secret-text">
                  You have not enetered a secret yet
                </p>
              </>
            )}

            {/* <h1 className="display-3">Your Secret is:</h1>
            <p className="secret-text">{mySecret}</p> */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
