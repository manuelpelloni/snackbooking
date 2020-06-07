import React from "react";
import "./Product.css";
import request from "../utils/http";

const Product = ({ product, redirectTo }) => {
  const addProductToCart = async () => {
    const body = {
      product_id: product.id,
    };
    const { added, message } = await request(
      "POST",
      "api/products/add-to-cart",
      redirectTo,
      body
    );
    if (added) console.log("implementa sti cazzo di alert", message);
  };

  return (
    <div>
      <button className="Product" onDoubleClick={addProductToCart}>
        <span>{product.name}</span>
        <br />
        <span>{product.price}€</span>
      </button>
    </div>
  );
};

export default Product;
