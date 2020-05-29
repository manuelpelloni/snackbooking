import React, { useEffect, useState } from "react";
import "./Cart.css";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import request from "../utils/http";

const Cart = () => {
  const [order, setOrder] = useState({});

  async function fetchOrder() {
    const response = await request("GET", "api/me/orders");
    const data = await response.json();

    setOrder(data);
  }

  useEffect(async () => {
    await fetchOrder();
  }, []);

  const components = [];
  try {
    const itemList = order.items;
    console.log(itemList);
    if (itemList) {
      for (const item of itemList) {
        components.push(<CartItem key={item.id} item={item} />);
      }
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="Cart">
      <div className="items-container ">{components}</div>
      <Navbar />
    </div>
  );
};

export default Cart;
