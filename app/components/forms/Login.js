import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./Forms.css";
import logo from "../../logo.svg";
import request from "../../utils/http";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    try {
      const body = { email, password };
      await request("POST", "/api/auth/login", navigate, body);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="Form-container">
      <Form
        onFinish={onSubmit}
        name="normal_login"
        className="login-form center"
        initialValues={{
          remember: true,
        }}
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
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            size="large"
            onChange={(e) => setEmail(e.target.value)}
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
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item className="no-whitespace">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <br />
          <Link to="/register">Registrati ora</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
