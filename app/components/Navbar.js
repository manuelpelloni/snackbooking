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
      <li className="pages">
        <Link to="/" className="link-color">
          <FontAwesomeIcon icon={faPizzaSlice} size="2x" />
          <span className="icon-description">Panini</span>
        </Link>
      </li>
      <li className="pages">
        <Link to="/cart" className="link-color">
          <FontAwesomeIcon icon={faShoppingBag} size="2x" />
          <span className="icon-description">Carrello</span>
        </Link>
      </li>
      <li className="pages">
        <Link to="/user" className="link-color">
          <FontAwesomeIcon icon={faUser} size="2x" />
          <span className="icon-description">Utente</span>
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
