import React, { useState, useEffect } from "react";
import "./User.css";
import Navbar from "./Navbar";
import request from "../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const [info, setInfo] = useState([]);

  async function fetchInfo() {
    const response = await request("GET", "api/me/info");
    const data = await response.json();
    setInfo(data);
  }

  let admin;
  if (info.admin) admin = "Paninara";
  else admin = "Studente";

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <div className="User">
      <div className="img">
        <FontAwesomeIcon icon={faUser} size="10x" />
      </div>
      <div className="info">
        {" "}
        Email: {info.email}
        <br />
        Classe: {info.class} <br /> Admin: {admin}{" "}
      </div>
      <Navbar />
    </div>
  );
};

export default User;
