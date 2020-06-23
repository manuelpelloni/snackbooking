import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";
import CartItem from "./CartItem";
import useModal from "./useModal";
import Modal from "./Modal";

import "./Cart.css";

import request from "../utils/http";

const Cart = () => {
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState(null);
  const [total, setTotal] = useState(null);
  const { isShowing, toggle } = useModal();

  const updateTotal = (num) => {
    return setTotal(total + num);
  };

  const sumbitOrder = async () => {
    await request("POST", "/api/orders/submit");
    setSubmitted(!submitted);
  };
  const cancelOrder = async () => {
    await request("POST", "/api/orders/cancel");
    setSubmitted(!submitted);
  };

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "api/me/orders").then((response) => {
      if (isSubscribed) {
        setOrder(response);
        setTotal(
          response.items.reduce(
            (total, item) => total + item.quantity * item.product.price,
            0
          )
        );
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [submitted]);

  if (order === null) return <Navbar />;

  const components = [];
  for (const item of order.items) {
    components.push(
      <CartItem key={item.product.id} item={item} updateTotal={updateTotal} />
    );
  }

  return (
    <div className="Cart">
      <div className="container ">
        <div className="items-container ">{components}</div>
        <hr className="total-line" />
        <span className="total">Totale: {total} €</span>
        <button
          className={
            order.submitted_at
              ? "order-button cancel-order"
              : "order-button submit-order"
          }
          onClick={toggle}
        >
          {order.submitted_at ? "Annulla Ordine" : "Ordina"}
        </button>
        <Modal
          isShowing={isShowing}
          hide={toggle}
          type={order.submitted_at ? "error" : "confirm"}
          title={
            order.submitted_at ? "Annullare Ordine?" : "Confermare l'ordine?"
          }
          message={order.submitted_at ? "" : "Totale: " + total + "€"}
          callback={order.submitted_at ? cancelOrder : sumbitOrder}
        />
      </div>
      <Navbar />
    </div>
  );
};

export default Cart;
