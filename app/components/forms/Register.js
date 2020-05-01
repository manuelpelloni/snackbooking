import React from "react";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import "./Forms.css";
import logo from "../../logo.svg";

const Register = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
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
        onFinish={onFinish}
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

        <Form.Item
          name="password2"
          rules={[
            {
              required: true,
              message: "Conferma la tua Password",
            },
          ]}
        >
          <Input.Password
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
            prefix={
              <BookOutlined className="site-form-item-icon uppercase-input" />
            }
            placeholder={`Classe (es ${year}${section})`}
            size="large"
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
