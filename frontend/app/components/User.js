import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faUnlock,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import "./User.css";
import "./EditProduct.css";

import Navbar from "./Navbar";
import useModal from "./useModal";
import Modal from "./Modal";

import request from "../utils/http";

const User = () => {
  const { isShowing, toggle } = useModal();

  const [info, setInfo] = useState(null);
  const [hours, setHours] = useState(null);
  const [minutes, setMinutes] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");

  const [input, setInput] = useState(false);
  const [input1, setInput1] = useState(false);
  const [input2, setInput2] = useState(false);

  const [areEquals, setAreEquals] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "/api/me/info").then((response) => {
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
    await request("PATCH", "/api/auth/logout");
  };

  const resetPassword = async () => {
    if (confirmPassword !== newPassword) return;

    const body = { oldPassword, newPassword, id: info.user_id };

    await request("PATCH", `/api/password/change`, body).then((response) => {
      if (response.success !== true) {
        console.log(response);

        setOldPassword("");
        setNewPassword("");
        SetConfirmPassword("");
      }
    });
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

      <div className="info after-first-info">
        <details>
          <summary>
            <h2 className="form-title">Modifica password</h2>
          </summary>
          <span className={`input-wrapper ${"input-wrapper-focused"}`}>
            <span className="input-prefix">
              <FontAwesomeIcon
                icon={input ? faUnlock : faLock}
                className="edit-product-icon"
                onClick={() => setInput(!input)}
              />
            </span>
            <input
              type={input ? "text" : "password"}
              placeholder="Vecchia password"
              onChange={(e) => setOldPassword(e.target.value)}
              className="input-text"
            />
          </span>
          <span className={`input-wrapper ${"input-wrapper-focused"}`}>
            <span className="input-prefix">
              <FontAwesomeIcon
                icon={input1 ? faUnlock : faLock}
                className="edit-product-icon"
                onClick={() => setInput1(!input1)}
              />
            </span>
            <input
              type={input1 ? "text" : "password"}
              placeholder="Nuova password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-text"
            />
          </span>
          <span className={`input-wrapper ${"input-wrapper-focused"}`}>
            <span className="input-prefix">
              <FontAwesomeIcon
                icon={input2 ? faUnlock : faLock}
                className="edit-product-icon"
                onClick={() => setInput2(!input2)}
              />
            </span>
            <input
              type={input2 ? "text" : "password"}
              placeholder="Conferma nuova password"
              onChange={(e) => {
                SetConfirmPassword(e.target.value);
                e.target.value === newPassword
                  ? setAreEquals(true)
                  : setAreEquals(false);
              }}
              className="input-number last-form-item"
            />
          </span>
          {!areEquals && <span className="input-error">Password diverse</span>}

          <button className="button update-button" onClick={resetPassword}>
            Modifica password
          </button>
        </details>
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
