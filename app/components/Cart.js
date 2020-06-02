import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import request from "../utils/http";

const Cart = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  async function fetchOrder() {
    const response = await request("GET", "api/me/orders");
    const data = await response.json();
    if (data.redirect) return navigate("/login");

    setOrder(data);
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  if (order === null) return <Navbar />;

  const itemList = order.items;
  const components = [];
  if (itemList) {
    for (const item of itemList) {
      components.push(<CartItem key={item.id} item={item} />);
    }
  }

  return (
    <div className="Cart">
      <div className="items-container ">{components}</div>
      <Navbar />
    </div>
  );
};

export default Cart;
