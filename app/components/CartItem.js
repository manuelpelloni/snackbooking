import React, { useState } from "react";
import "./CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import request from "../utils/http";
import { CSSTransition } from "react-transition-group";

const CartItem = ({ item, redirectTo }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [itemVisibility, setItemVisibility] = useState(true);
  const body = {
    product_id: item.product.id,
  };

  async function addItemToDB() {
    const { success, message } = await request(
      "POST",
      "api/products/add-to-cart",
      redirectTo,
      body
    );
    if (!success) console.log("implementa sti cazzo di alert", message);
  }
  async function removeOneItemFromDB() {
    const { success, message } = await request(
      "POST",
      "api/products/remove-one-from-cart",
      redirectTo,
      body
    );
    if (!success) console.log("implementa sti cazzo di alert", message);
  }
  async function deleteItemFromDB() {
    const { success, message } = await request(
      "POST",
      "api/products/delete-from-cart",
      redirectTo,
      body
    );
    if (!success) console.log("implementa sti cazzo di alert", message);
  }

  const addItemToCart = async () => {
    await addItemToDB();
    setQuantity(quantity + 1);
  };
  const removeOneItemFromCart = async () => {
    if (quantity >= 2) {
      await removeOneItemFromDB();
      setQuantity(quantity - 1);
    }
  };
  const deleteItemFromCart = async () => {
    await deleteItemFromDB();
  };

  return (
    <CSSTransition
      in={itemVisibility}
      timeout={300}
      classNames="CartItem"
      unmountOnExit
      onExit={deleteItemFromCart}
    >
      <li onClick="">
        <span className="item-name">{item.product.name}</span>
        <span className="item-description">{item.product.description}</span>
        <div className="button-container">
          <span>Quantità</span>
          <span>Importo</span>
          <span></span>
          <div className="add-remove-item">
            <button className="remove-item" onClick={removeOneItemFromCart}>
              <FontAwesomeIcon icon={faMinusSquare} className="icon-size" />
            </button>
            <span className="show-text quantity">{quantity}</span>
            <button className="add-item" onClick={addItemToCart}>
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
            className="delete-item"
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
