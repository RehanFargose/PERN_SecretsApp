import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// React's version of href tag but better and can send data
import { Link } from "react-router-dom";

// To receive data sent via navigate from other pages
import { useLocation } from "react-router-dom";

// To send data between pages
import { useNavigate } from "react-router-dom";

export default function SecretsPage(props) {
  // To pass data to other pages
  const navigate = useNavigate();

  // location acts similar to prop, it holds info sent by the previous page
  const location = useLocation();

  const userID = location.state?.userDetails.id;
  const userName = location.state?.userDetails.email;
  const pass = location.state?.userDetails.password;

  // const mySecret = location.state?.userData.secret;

  const [mySecret, setSecret] = useState();

  async function name(params) {}

  useEffect(() => {
    setSecret(location.state?.userDetails.secret || null);
    console.log("The secret received in new page is:");
    console.log(mySecret);
  }, [location.state?.userData?.secret]);

  return (
    <>
      <div className="page-container">
        <Header />

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
