import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import SubmitOrder from "./SubmitOrder";
import request from "../utils/http";

const Cart = () => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(null);

  async function fetchOrder() {
    const response = await request("GET", "api/me/orders", navigate);
    setOrderItems(response.items);
  }

  const removeItem = (id) => {
    setOrderItems((orderItems) => {
      return orderItems.filter((item) => item.product.id !== id);
    });
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (orderItems === null) return <Navbar />;

  const components = [];
  for (const item of orderItems) {
    components.push(
      <CartItem
        key={item.product.id}
        item={item}
        removeChildItem={removeItem}
        redirectTo={navigate}
      />
    );
  }

  return (
    <div className="Cart">
      <div className="items-container ">
        {components}
        {<SubmitOrder />}
      </div>
      <Navbar />
    </div>
  );
};

export default Cart;
