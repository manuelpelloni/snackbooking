import React, { useState } from "react";
import "./SubmitOrder.css";
import request from "../utils/http";

const SubmitOrder = ({ submitted }) => {
  let buttonText = submitted ? "Annulla Ordine" : "Ordina";

  return (
    <button className="SubmitOrder" onClick="">
      {buttonText}
    </button>
  );
};

export default SubmitOrder;
