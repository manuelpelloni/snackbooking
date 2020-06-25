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
    const { message } = await request("PATCH", "api/auth/logout");
    if (message) alert(message);
  };

  if (info === null) return <Navbar />;

  const admin = info.admin ? "Paninara" : "Studente";

  return (
    <div className="User">
      <div className="img">
        <FontAwesomeIcon icon={faUser} size="10x" />
      </div>
      <div className="info">
        <span className="info-name">Email:</span>{" "}
        <span className="info-description">
          {info.email}
          <br />
        </span>
        <span className="info-name">Classe:</span>{" "}
        <span className="info-description">{info.class.toUpperCase()}</span>
        <br />
        <span className="info-name">Account:</span>{" "}
        <span className="info-description">{admin}</span>
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
