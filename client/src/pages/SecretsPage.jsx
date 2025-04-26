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

  // To hold a random secret retrieved from DB
  const [secret, setSecret] = useState();

  // To handle loading and rendering issue
  const [isLoading, setIsLoading] = useState(true);

  // Function to retrieve user's secret
  async function getSecret(event) {
    try {
      // Get a random secret from the backend api server
      const response = await axios.get(API_URL + "/secrets/" + userID, {
        withCredentials: true,
      });

      // To retrieve data via axios do response.data.dictname
      // and not response.rows >> this is used for sql query response not axios response
      const someSecret = response.data.secret;

      // console.log("Random retrieved secret is: ");
      // console.log(someSecret);

      // Retrun the secret which can be used via setState
      return someSecret;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Wrap main call in another async arrow func so that we can use await/async func there
  // async func cant be used directly inside useEffect, needs an extra wrapper
  const fetchSecret = async () => {
    // Call function to retrieve secrets from DB
    const newSecret = await getSecret();

    // Set state when component mounts
    // setSecret(location.state?.userDetails.secret || null);
    setSecret(newSecret || null);

    // loading rendering fix
    setIsLoading(false);

    // console.log("The secret received in new page is:");
    // console.log(secret);
  };

  // Always runs on page refresh at least once
  useEffect(() => {
    // Call fetch secret
    fetchSecret();
  }, []);

  // To log freshly updated secret
  useEffect(() => {
    console.log("The secret received in new page is:");
    console.log(secret);
  }, [secret]);

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
            {/* {secret ? (
              <>
                {" "}
                <h1 className="display-3">Random Secret is:</h1>
                <p className="secret-text">{secret}</p>
              </>
            ) : (
              <>
                <h1 className="display-3">No Secret available</h1>
                <p className="secret-text">
                  You have not enetered a secret yet
                </p>
              </>
            )} */}

            {/* Use conditional rendering */}

            {isLoading ? (
              <h1 className="display-3">Loading secret...</h1>
            ) : secret ? (
              <>
                <h1 className="display-3">Random Secret is:</h1>
                <p className="secret-text">{secret}</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={(event) => {
                    event.preventDefault();

                    fetchSecret();
                  }}
                >
                  🔁 Get Random Secret
                </button>
              </>
            ) : (
              <>
                <h1 className="display-3">No Secret available</h1>
                <p className="secret-text">You have not entered a secret yet</p>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={(event) => {
                    event.preventDefault();

                    fetchSecret();
                  }}
                >
                  🔁 Try Get Secret
                </button>
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
