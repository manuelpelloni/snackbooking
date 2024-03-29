import React from "react";
import { Layout } from "antd";
import Login from "./components/forms/Login";
import Register from "./components/forms/Register";
import Home from "./components/Home";
import Cart from "./components/Cart";
import User from "./components/User";
import EditProduct from "./components/EditProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import userManual from "./userManual.pdf";
import "./App.css";

const { Header, Content } = Layout;
function App() {
  return (
    <Layout className="Layout">
      <Header className="header">
        <span className="header-title">Snack-Booking</span>
        <span className="pdf">
          <a className="link" href={userManual}>
            <FontAwesomeIcon icon={faInfo} size="1x" />
          </a>
        </span>
      </Header>
      <Content>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<User />} />
            <Route path="/product/new" element={<EditProduct />} />
            <Route path="/product/:id" element={<EditProduct />} />
          </Routes>
        </Router>
      </Content>
    </Layout>
  );
}

export default App;
