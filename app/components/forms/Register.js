import React, { useState, reactDOM, mountNode } from "react";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import { Form, Input, Button, Alert } from "antd";
import "./Forms.css";
import logo from "../../logo.svg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [class_section, setYear] = useState("");

  const onSubmit = async () => {
    console.log(password, confirm);
    let response;
    if (password === confirm) {
      try {
        response = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_section,
            email,
            password,
          }),
        });
      } catch (err) {
        console.error(err);
      }
      console.log(response);
    }
  };

  const passwordComparator = () => {
    if (!password === confirm) {
    }
  };
  const year = Math.round(Math.random() * 4 + 1);
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const section = uppercaseLetters.charAt(
    Math.round(Math.random() * uppercaseLetters.length - 1)
  );

  return (
    <div className="Form-container">
      <Form
        name="normal_login"
        className="login-form center"
        initialValues={{
          remember: true,
        }}
        onFinish={onSubmit}
      >
        <img src={logo} alt="Logo" className="form-logo" />

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Inserisci la tua Email",
            },
          ]}
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Inserisci la tua Password",
            },
          ]}
        >
          <Input.Password
            onChange={(e) => setPassword(e.target.value)}
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="password2"
          rules={[
            {
              required: true,
              message: "Conferma la tua Password",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Le password non coincidono");
              },
            }),
          ]}
        >
          <Input.Password
            onChange={(e) => setConfirm(e.target.value)}
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Conferma Password"
          />
        </Form.Item>

        <Form.Item
          name="classSection"
          rules={[
            {
              required: true,
              message: "Inserisci la tua Classe e la Sezione",
            },
          ]}
        >
          <Input
            className="uppercase-input"
            onChange={(e) => setYear(e.target.value)}
            prefix={<BookOutlined className="site-form-item-icon" />}
            placeholder={`Classe (es ${year}${section})`}
            size="large"
            maxLength="2"
          />
        </Form.Item>

        <Form.Item className="no-whitespace">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Registrati
          </Button>
          <br />
          <Link to="/login">Login</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
