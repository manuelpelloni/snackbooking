import React from "react";
import { useState } from 'react';
import "./Product.css";

import request from "../utils/http";

const Product = ({ product }) => {
  const [classe, Setclasse] = useState("Product");

  const addProductToCart = async () => {
    Setclasse("Added");
    setTimeout(() => {Setclasse("Product")}, 2000);
    const body = {
      product_id: product.id,
    };
    const { added, message } = await request(
      "POST",
      "api/products/add-to-cart",
      body
    );
    if (added) console.log("implementa sti cazzo di alert", message);
  };
  

  return (
    <div>
      <button className= {classe} onDoubleClick={addProductToCart}>
        <span>{product.name}</span>
        <br />
        <span>{product.price}€</span>
      </button>
    </div>
  );
};

export default Product;