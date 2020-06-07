import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css";
import Navbar from "./Navbar";
import request from "../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);

  async function fetchInfo() {
    const response = await request("GET", "api/me/info", navigate);
    setInfo(response);
  }

  useEffect(() => {
    fetchInfo();
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
        Email: {info.email}
        <br />
        Classe: {info.class.toUpperCase()}
        <br />
        Account: {admin}
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
