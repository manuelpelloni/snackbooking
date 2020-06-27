import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";

import AdminOrdersItem from "./AdminOrdersItem";
import "./AdminOrders.css";

import request from "../utils/http";

const AdminOrders = () => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "/api/orders").then((response) => {
      if (!isSubscribed) return;
      setOrders(response);
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (orders === null) return null;

  const components = [];

  for (const item of orders) {
    components.push(<AdminOrdersItem key={item.class} order={item} />);
  }

  return (
    <>
      <div className="AdminOrder">
        <div className="AdminOrder-container">
          {components}
          <hr className="line-total" />
          <div className="total">
            {orders.reduce(
              (accumulator, order) =>
                accumulator +
                order.items.reduce(
                  (accumulator2, item) =>
                    accumulator2 + item.price * item.quantity,
                  0
                ),
              0
            )}
            €
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default AdminOrders;
