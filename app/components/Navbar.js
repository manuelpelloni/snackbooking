import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "../navbarHome.svg";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <ul className="Navbar">
      <li className="pages">
        <Link to="/" className="link-color">
          <img src={Logo} className="navbar-icon" />
          <span>panini</span>
        </Link>
      </li>
      <li className="pages">
        <Link to="/" className="link-color">
          <img src={Logo} className="navbar-icon" />
          <span>placeholder</span>
        </Link>
      </li>
      <li className="pages">
        <Link to="/" className="link-color">
          <img src={Logo} className="navbar-icon" />
          <span>placeholder</span>
        </Link>
      </li>
    </ul>
  );
};

export default Navbar;
