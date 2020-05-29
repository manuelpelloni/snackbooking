import React, {useState} from "react";
import "./CartItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faMinusSquare,

} from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ item }) => {
  const [ quantity, setQuantity ] = useState(item.quantity);

  function checkQuantity(){
    if(quantity)
      setQuantity(quantity-1);
  }

  return (
    <div>
      <button className="CartItem" onClick="">
        <span className="item-name">{item.product.name}</span>
        <button className="remove-item" onClick={() => checkQuantity()}>
          <FontAwesomeIcon icon={faMinusSquare} size="2x" />
        </button>
          <input type="text" className="quantity-value" value={quantity} />
        <button className="add-item" onClick={() => setQuantity(quantity+1)}>
          <FontAwesomeIcon icon={faPlusSquare} size="2x" />
        </button>
      </button>
    </div>
  );
};

export default CartItem;
