import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./User.css";

import Navbar from "./Navbar";
import useModal from "./useModal";
import Modal from "./Modal";

import request from "../utils/http";

const User = () => {
  const { isShowing, toggle } = useModal();

  const [info, setInfo] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "api/me/info").then((response) => {
      if (isSubscribed) {
        setInfo(response.user);
        setHours(response.hours);
        setMinutes(response.minutes);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const logout = async () => {
    const { message } = await request("PATCH", "api/auth/logout");
    if (message) alert(message);
  };

  const handleChange = (event) => {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));

    max > 23 ? setMinutes(value) : setHours(value);
  };

  const setOrderTimeLimit = async () => {
    const body = { hours, minutes };
    await request("POST", "/api/me/order-time-limit", body);
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
        <div className="order-time-limit">
          <span className="info-name">Limite orario ordinazione:</span>
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={handleChange}
            className="time-limit"
            disabled={!info.admin}
          />
          :
          <input
            type="number"
            min="0"
            max="60"
            value={minutes}
            onChange={handleChange}
            className="time-limit"
            disabled={!info.admin}
          />
          {info.admin && (
            <button className="set-order-time button" onClick={toggle}>
              Conferma
            </button>
          )}
          <Modal
            isShowing={isShowing}
            hide={toggle}
            type="confirm"
            title="Cambiare l'orario"
            message="Cliccando su conferma cambierai l'orario limite di prenotazione/annullamento degli ordini"
            callback={setOrderTimeLimit}
          />
        </div>
      </div>
      <button onClick={logout} className="logout-button button">
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
