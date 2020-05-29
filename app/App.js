import React from "react";
import { Layout } from "antd";
import Login from "./components/forms/Login";
import Register from "./components/forms/Register";
import Home from "./components/Home";
import Cart from "./components/Cart";
import User from "./components/User";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

const { Header, Content } = Layout;
function App() {
  return (
    <Layout className="Layout">
      <Header className="header">
        <span className="header-title">Snack-Booking</span>
      </Header>
      <Content>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </Router>
      </Content>
    </Layout>
  );
}

export default App;
