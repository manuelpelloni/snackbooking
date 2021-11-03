import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Forms.css";
import request from "../../utils/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [class_section, setYear] = useState("");
  const [year] = useState(Math.round(Math.random() * 4 + 1));
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [section] = useState(
    uppercaseLetters.charAt(
      Math.round(Math.random() * uppercaseLetters.length - 1)
    )
  );
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (password === confirm) {
      try {
        console.log(password, confirm);
        const registrationBody = { email, password, class_section };
        const { message1 } = await request(
          "POST",
          "/api/auth/register",
          registrationBody
        );
        if (message1) alert(message1);

        const loginBody = { email, password };
        const { message2 } = await request(
          "POST",
          "/api/auth/login",
          loginBody
        );
        if (!message2) navigate("/");
        else alert(message2);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="Form-container">
      <form className="login-form center">
        <div className="input-wrapper">
          <span>
            <FontAwesomeIcon icon={faUser} className="" />
          </span>
          <input
            type="email"
            placeholder="Enter user email"
            required
            aria-required
          />
        </div>
        <div className="input-wrapper">
          <span>
            <FontAwesomeIcon icon={faLock} className="" />
          </span>
          <input
            type="password"
            placeholder="Enter user password"
            required
            aria-required
          />
        </div>
        <div className="input-wrapper">
          <span>
            <FontAwesomeIcon icon={faLock} className="" />
          </span>
          <input type="password" placeholder="Confirm user password" />
        </div>
        <input type="submit" value="Register" onClick={() => onSubmit()} />
      </form>
      <Link to="/login">Sign in</Link>
    </div>
  );
};

export default Register;
