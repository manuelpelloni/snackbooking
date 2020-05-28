import React from "react";
import "./CartItem.css";

const CartItem = ({ item }) => {
  return (
    <div>
      <button className="CartItem" onClick="">
        <span>{item.name}</span>
        <input type="number" value={item.quantity} />
      </button>
    </div>
  );
};

export default CartItem;
