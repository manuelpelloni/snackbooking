import React, { useEffect, useState } from "react";
import "./Cart.css";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import request from "../utils/http";

const Cart = () => {
  const [list, setList] = useState([]);

  async function fetchItems() {
    const response = await request("GET", "api/me/orders");
    const data = await response.json();
    setList(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const components = [];
  for (const item of list) {
    components.push(<CartItem key={item.id} product={item} />);
  }

  return (
    <div className="Cart">
      <div className="items-container "></div>
      <Navbar />
    </div>
  );
};

export default Cart;
