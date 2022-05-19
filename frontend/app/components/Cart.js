import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";
import CartItem from "./CartItem";
import AdminOrders from "./AdminOrders";
import useModal from "./useModal";
import Modal from "./Modal";

import "./Cart.css";

import request from "../utils/http";

const Cart = () => {
  const [submitted, setSubmitted] = useState(false);
  const [buttonState, setButtonState] = useState({
    disabled: false,
    class: "",
  });
  const { isShowing, toggle } = useModal();

  const [userInfo, setUserInfo] = useState(null);

  const [order, setOrder] = useState(null);
  const [total, setTotal] = useState(null);

  const updateTotal = (num) => {
    return setTotal(parseFloat(total) + parseFloat(num));
  };
  const sumbitOrder = async () => {
    await request("POST", "/api/cart/submit");
    setSubmitted(!submitted);
  };
  const cancelOrder = async () => {
    await request("POST", "/api/cart/cancel");
    setSubmitted(!submitted);
  };

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "/api/me/orders").then((response) => {
      if (!isSubscribed) return null;
      setOrder(response);
      setTotal(
        response.items.reduce(
          (total, item) =>
            parseFloat(total) + parseFloat(item.quantity) * parseFloat(item.product.price),
          0
        )
      );
      if (response.submitted_at) {
        setButtonState({
          disabled: true,
          cartItem: "untouchable",
          cursor: "",
        });
      } else {
        setButtonState({ disabled: false, cartItem: "", cursor: "cursor" });
      }
    });

    request("GET", "/api/me/info").then((response) => {
      if (!isSubscribed) return;
      setUserInfo(response.user);
    });

    return () => {
      isSubscribed = false;
    };
  }, [submitted]);

  if (order === null || userInfo === null) return null;

  const components = [];
  for (const item of order.items) {
    components.push(
      <CartItem
        key={item.product.id}
        item={item}
        updateTotal={updateTotal}
        buttonState={buttonState}
      />
    );
  }
  if (userInfo.admin) {
    return <AdminOrders />;
  } else {
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
  }
};

export default Cart;
