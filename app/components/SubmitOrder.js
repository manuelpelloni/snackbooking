import React from "react";
import "./SubmitOrder.css";

const SubmitOrder = ({ submitted }) => {
  let buttonText = submitted ? "Annulla Ordine" : "Ordina";

  return (
    <button className="SubmitOrder" onClick="">
      {buttonText}
    </button>
  );
};

export default SubmitOrder;
