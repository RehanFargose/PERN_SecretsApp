import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Error 404 page is also known as NoPage
export default function NoPage(props) {
  var myStyle = {
    colour: "red",
  };

  return (
    <>
      <div className="page-container">
        <Header />
        <h2 style={myStyle}>Error 404: Not Found</h2>
        <Footer />
      </div>
    </>
  );
}
