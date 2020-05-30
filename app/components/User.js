import React, { useState, useEffect } from "react";
import "./User.css";
import Navbar from "./Navbar";
import request from "../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const [info, setInfo] = useState(null);

  async function fetchInfo() {
    const response = await request("GET", "api/me/info");
    const data = await response.json();
    setInfo(data);
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  if (info === null) return null;

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
      <Navbar />
    </div>
  );
};

export default User;
