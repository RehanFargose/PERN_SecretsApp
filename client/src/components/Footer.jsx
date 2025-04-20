import React from "react";
import { Link } from "react-router-dom";

export default function Footer(props) {
  var thisYear = new Date().getFullYear();

  return (
    <>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <Link
            to="/"
            className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
            aria-label="Bootstrap"
          >
            <svg className="bi" width="30" height="24" aria-hidden="true">
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </Link>
          <span className="mb-3 mb-md-0 text-body-secondary">
            © {thisYear} Company, Inc
          </span>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <Link className="text-body-secondary" to="/" aria-label="Instagram">
              <svg className="bi" width="24" height="24" aria-hidden="true">
                <use xlinkHref="#instagram"></use>
              </svg>
            </Link>
          </li>

          <li className="ms-3">
            <Link className="text-body-secondary" to="/" aria-label="Facebook">
              <svg className="bi" width="24" height="24">
                <use xlinkHref="#facebook"></use>
              </svg>
            </Link>
          </li>
        </ul>
      </footer>
    </>
  );
}
