import React, { useState } from "react";
import "./CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faMinusSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import request from "../utils/http";

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [visible, setVisible] = useState(true);

  async function addItemToDB() {
    const body = {
      product_id: item.product.id,
    };
    const { added, message } = await request(
      "POST",
      "api/products/add-to-cart",
      body
    );
    if (added) console.log("implementa sti cazzo di alert", message);
  }
  async function deleteItemFromDB() {
    const body = {
      product_id: item.product.id,
    };
    const { deleted, message } = await request(
      "POST",
      "api/products/delete-from-cart",
      body
    );
    if (deleted) console.log("implementa sti cazzo di alert", message);
  }

  function checkQuantity() {
    if (quantity >= 2) setQuantity(quantity - 1);
  }

  const addItemToCart = async () => {
    await addItemToDB();
    setQuantity(quantity + 1);
  };

  const deleteItemFromCart = async () => {
    await deleteItemFromDB();
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <div className="CartItem" onClick="">
          <span className="item-name">{item.product.name}</span>
          <span className="item-description">{item.product.description}</span>
          <div className="button-container">
            <div className="add-remove-item">
              <button className="remove-item" onClick={() => checkQuantity()}>
                <FontAwesomeIcon icon={faMinusSquare} className="icon-size" />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button className="add-item" onClick={addItemToCart}>
                <FontAwesomeIcon icon={faPlusSquare} className="icon-size" />
              </button>
            </div>
            <div className="price-container">
              <span>Importo</span>
              <span className="price"> {quantity * item.product.price}€</span>
            </div>
            <button className="delete-item" onClick={deleteItemFromCart}>
              <FontAwesomeIcon icon={faTrashAlt} className="icon-size" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
