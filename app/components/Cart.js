import React from "react";
import "./Cart.css";
import Navbar from "./Navbar";
import http from "../utils/http";

const Cart = () => {
  return (
    <div className="Cart">
      <div className="products-container "></div>
      <Navbar />
    </div>
  );
};

export default Cart;
