import React, { useState } from "react";
import "./CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  function checkQuantity() {
    if (quantity >= 2) setQuantity(quantity - 1);
  }

  return (
    <div className="CartItem" onClick="">
      <span className="item-name">{item.product.name}</span>
      <span className="item-description">{item.product.description}</span>
      <div className="button-container">
        <div className="add-remove-item">
          <button className="remove-item" onClick={() => checkQuantity()}>
            <FontAwesomeIcon icon={faMinusSquare} className="icon-size" />
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            className="add-item"
            onClick={() => setQuantity(quantity + 1)}
          >
            <FontAwesomeIcon icon={faPlusSquare} className="icon-size" />
          </button>
        </div>
        <div className="price-container">
          <span>Importo</span>
          <span className="price"> {quantity * item.product.price}€</span>
        </div>
        <button className="delete-item">
          <FontAwesomeIcon icon={faTrashAlt} className="icon-size" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
