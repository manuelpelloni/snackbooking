import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";
import CartItem from "./CartItem";

import "./Cart.css";

import request from "../utils/http";

const Cart = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "api/me/orders").then((response) => {
      if (isSubscribed) setOrder(response);
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (order === null) return <Navbar />;

  const components = [];
  for (const item of order.items) {
    components.push(<CartItem key={item.product.id} item={item} />);
  }

  return (
    <div className="Cart">
      <div className="items-container ">
        {components}
        <button className="submit-order" onClick="">
          {order.submitted_at ? "Annulla Ordine" : "Ordina"}
        </button>
      </div>
      <Navbar />
    </div>
  );
};

export default Cart;
