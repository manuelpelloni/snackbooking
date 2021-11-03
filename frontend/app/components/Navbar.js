import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faPizzaSlice,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <ul className="Navbar">
      <li className="">
        <Link to="/" className="link-color">
          <FontAwesomeIcon icon={faPizzaSlice} size="2x" />
        </Link>
      </li>
      <li className="">
        <Link to="/cart" className="link-color">
          <FontAwesomeIcon icon={faShoppingBag} size="2x" />
        </Link>
      </li>
      <li className="">
        <Link to="/user" className="link-color">
          <FontAwesomeIcon icon={faUser} size="2x" />
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
