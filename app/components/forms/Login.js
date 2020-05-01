import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "./Forms.css";
import logo from "../../logo.svg";

const Login = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="Form-container">
      <Form
        name="normal_login"
        className="login-form center"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <img src={logo} className="form-logo" />

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
