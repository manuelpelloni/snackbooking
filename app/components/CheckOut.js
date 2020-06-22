import React from "react";
import "./CheckOut.css";

const CheckOut = ({ items }) => {
  return (
    <div className="CheckOut">
      <strong>
        <span>
          Totale: {() => items.reduce(items.price * items.quantity)} €
        </span>
      </strong>
    </div>
  );
};

export default CheckOut;
