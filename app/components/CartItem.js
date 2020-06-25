import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import "./CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import request from "../utils/http";

const CartItem = ({ item, updateTotal, buttonState }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [itemVisibility, setItemVisibility] = useState(true);
  const body = {
    product_id: item.product.id,
  };

  async function addItemToDB() {
    const { success, message } = await request(
      "POST",
      "api/products/add-to-cart",
      body
    );
    if (success) alert(message);
  }
  async function removeOneItemFromDB() {
    const { success, message } = await request(
      "POST",
      "api/products/remove-one-from-cart",
      body
    );
    if (success) alert(message);
  }
  async function deleteItemFromDB() {
    const { success, message } = await request(
      "POST",
      "api/products/delete-from-cart",
      body
    );
    if (success) alert(message);
  }

  const addItemToCart = async () => {
    await addItemToDB();
    setQuantity(quantity + 1);
    updateTotal(item.product.price);
  };
  const removeOneItemFromCart = async () => {
    if (quantity >= 2) {
      await removeOneItemFromDB();
      setQuantity(quantity - 1);
      updateTotal(-item.product.price);
    }
  };
  const deleteItemFromCart = async () => {
    await deleteItemFromDB();
    updateTotal(-item.product.price * quantity);
  };

  return (
    <CSSTransition
      in={itemVisibility}
      timeout={300}
      classNames="CartItem"
      unmountOnExit
      onExit={deleteItemFromCart}
    >
      <li className={`CartItem ${buttonState.cartItem}`}>
        <span className="item-name">{item.product.name}</span>
        <span className="item-description">{item.product.description}</span>
        <div className="button-container">
          <span>Quantità</span>
          <span>Importo</span>
          <span></span>
          <div className="add-remove-item">
            <button
              disabled={buttonState.disabled}
              className={`remove-item ${buttonState.cursor}`}
              onClick={removeOneItemFromCart}
            >
              <FontAwesomeIcon icon={faMinusSquare} className="icon-size" />
            </button>
            <span className="show-text quantity">{quantity}</span>
            <button
              disabled={buttonState.disabled}
              className={`add-item ${buttonState.cursor}`}
              onClick={addItemToCart}
            >
              <FontAwesomeIcon icon={faPlusSquare} className="icon-size" />
            </button>
          </div>
          <div className="price-container">
            <span className="show-text money-amount">
              {" "}
              {quantity * item.product.price}
            </span>
            €
          </div>
          <button
            disabled={buttonState.disabled}
            className={`delete-item ${buttonState.cursor}`}
            onClick={() => setItemVisibility(false)}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="icon-size" />
          </button>
        </div>
      </li>
    </CSSTransition>
  );
};

export default CartItem;
