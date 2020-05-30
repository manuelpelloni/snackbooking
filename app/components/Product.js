import React from "react";
import "./Product.css";

const Product = ({ product }) => {
  return (
    <div>
      <button className="Product" onClick="">
        <span>{product.name}</span>
        <br />
        <span>{product.price}€</span>
      </button>
    </div>
  );
};

export default Product;
