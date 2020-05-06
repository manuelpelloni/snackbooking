import React, { useState } from "react";
import { Button } from "antd";
import "./Product.css";

const Product = ({ product }) => {
  return (
    <div>
      <button className="Product" onClick="">
        <span>{product.name}</span>
      </button>
    </div>
  );
};

export default Product;
