import React, { useEffect, useState } from "react";

import "./Cart.css";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import SubmitOrder from "./SubmitOrder";

import request from "../utils/http";

const Cart = () => {
  const [orderItems, setOrderItems] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "api/me/orders").then((response) => {
      if (isSubscribed) setOrderItems(response.items);
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (orderItems === null) return <Navbar />;

  const components = [];
  for (const item of orderItems) {
    components.push(<CartItem key={item.product.id} item={item} />);
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
