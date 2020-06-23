import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./User.css";
import Navbar from "./Navbar";

import request from "../utils/http";

const User = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "api/me/info").then((response) => {
      if (isSubscribed) setInfo(response);
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const logout = async () => {
    await request("PATCH", "api/auth/logout");
  };

  if (info === null) return <Navbar />;

  const admin = info.admin ? "Paninara" : "Studente";

  return (
    <div className="User">
      <div className="img">
        <FontAwesomeIcon icon={faUser} size="10x" />
      </div>
      <div className="info">
        <span className="info-name">Email:</span> {info.email}
        <br />
        <span className="info-name">Classe:</span> {info.class.toUpperCase()}
        <br />
        <span className="info-name">Account:</span> {admin}
      </div>
      <button onClick={logout} className="logout-button">
        <Link to="/login" className="logout-icon-color ">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="4x"
            className="logout-icon"
          />
        </Link>
      </button>

      <Navbar />
    </div>
  );
};

export default User;
