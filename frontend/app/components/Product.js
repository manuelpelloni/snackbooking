import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Product.css";

import request from "../utils/http";

const Product = ({ product, admin }) => {
  const [doubleClickAnimation, setDoubleClickAnimation] = useState("");

  const addProductToCart = async () => {
    setDoubleClickAnimation("Product-expand");
    setTimeout(() => {
      setDoubleClickAnimation("");
    }, 200);
    const body = {
      product_id: product.id,
    };
    const { added, message } = await request("POST", "/api/cart/add", body);
    if (added) console.log("implementa sti cazzo di alert", message);
  };

  if (admin) {
    return (
      <Link to={`/product/${product.id}`} className="Product">
        <p>{product.name}</p>
        <p>{product.price}€</p>
      </Link>
    );
  } else {
    return (
      <button
        className={`Product ${doubleClickAnimation}`}
        onClick={addProductToCart}
      >
        <p>{product.name}</p>
        <p>{product.price}€</p>
      </button>
    );
  }
};

export default Product;
