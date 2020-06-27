import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompress, faExpand } from "@fortawesome/free-solid-svg-icons";

import "./AdminOrdersItem.css";

const AdminOrdersItem = ({ order }) => {
  const [showMore, setShowMore] = useState(false);

  const components = [];

  for (const item of order.items) {
    components.push(
      <div className="show-more">
        <span className="show-more-name">{item.name}</span>
        <span className="show-more-quantity">{item.quantity} unità</span>
        <span className="show-more-price">{item.price * item.quantity} €</span>
      </div>
    );
  }

  return (
    <div onClick={() => setShowMore(!showMore)} className="AdminOrderItem">
      <div className="AdminOrderItem-header">
        {showMore && (
          <FontAwesomeIcon
            icon={faCompress}
            className="AdminOrderItem-header-icon"
          />
        )}
        {!showMore && (
          <FontAwesomeIcon
            icon={faExpand}
            className="AdminOrderItem-header-icon"
          />
        )}
        <span>Classe: {order.class}</span>
        <span>
          Unità:{" "}
          {order.items.reduce(
            (accumulator, item) => accumulator + item.quantity,
            0
          )}
        </span>
        <span>
          Totale:{" "}
          {order.items.reduce(
            (accumulator, item) => accumulator + item.price * item.quantity,
            0
          )}
          €
        </span>
      </div>

      {showMore && (
        <>
          <hr />
          <div>{components}</div>
        </>
      )}
    </div>
  );
};

export default AdminOrdersItem;
