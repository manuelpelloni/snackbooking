import React from "react";
import Login from "./components/forms/Login";
import Register from "./components/forms/Register";
import Home from "./components/Home";
import Cart from "./components/Cart";
import User from "./components/User";
import EditProduct from "./components/EditProduct";
import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="header">
          <a className="search">
            <FontAwesomeIcon icon={faSearch} size="1x" />
          </a>
        </div>
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<User />} />
            <Route path="/product/new" element={<EditProduct />} />
            <Route path="/product/:id" element={<EditProduct />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
