import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Forms.css";
import request from "../../utils/http";
import handleSubmit from "../../utils/form";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async () => {
    try {
      const body = { email, password };
      const { message } = await request("POST", "/api/auth/login", body);
      if (!message) navigate("/");
      else alert(message);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Form-container">
      <form
        onSubmit={(e) => handleSubmit(e, loginSubmit)}
        className="login-form center"
      >
        <div className="input-wrapper">
          <span>
            <FontAwesomeIcon icon={faUser} className="" />
          </span>
          <input
            type="email"
            placeholder="Enter your user email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper">
          <span>
            <FontAwesomeIcon icon={faLock} className="" />
          </span>
          <input
            type="password"
            placeholder="Enter your user password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <input type="submit" value="Submit" />
      </form>
      <Link to="/register">Sign up</Link>
    </div>
  );
};

export default Login;
