import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faEdit } from "@fortawesome/free-solid-svg-icons";
import "././forms/Forms.css";
import "./EditProduct.css";

import useFocus from "./useFocus";
import request from "../utils/http";

const AlterProduct = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);

  const ref = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const focused = useFocus(ref);
  const focused1 = useFocus(ref1);
  const focused2 = useFocus(ref2);

  const editProduct = () => {
    const body = { name, description, price };
    const url = id ? `/api/products/${id}` : `/api/products`;

    request("POST", url, body).then(() => {
      navigate("/");
    });
  };

  const deleteProduct = () => {
    request("DELETE", `/api/products/${id}`).then(() => {
      navigate("/");
    });
  };

  useEffect(() => {
    let isSubscribed = true;

    if (id) {
      request("GET", `/api/products/${id}`).then((response) => {
        if (isSubscribed) {
          setName(response.name);
          setDescription(response.description);
          setPrice(response.price);
        }
      });
    }

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  return (
    <div className="EditProduct">
      <div className="edit-product-container">
        <h2 className="form-title">{id ? "Modifica" : "Aggiungi"}</h2>
        <span className={`input-wrapper ${focused && "input-wrapper-focused"}`}>
          <span className="input-prefix">
            <FontAwesomeIcon icon={faEdit} className="edit-product-icon" />
          </span>
          <input
            ref={ref}
            type="text"
            value={name}
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
            className="input-text"
          />
        </span>
        <span
          className={`input-wrapper ${focused1 && "input-wrapper-focused"}`}
        >
          <span className="input-prefix">
            <FontAwesomeIcon icon={faEdit} className="edit-product-icon" />
          </span>
          <input
            ref={ref1}
            type="text"
            value={description}
            placeholder="Descrizione (opzionale)"
            onChange={(e) => setDescription(e.target.value)}
            className="input-text"
          />
        </span>
        <span
          className={`input-wrapper ${focused2 && "input-wrapper-focused"}`}
        >
          <span className="input-prefix">
            <FontAwesomeIcon icon={faEuroSign} className="edit-product-icon" />
          </span>
          <input
            ref={ref2}
            type="number"
            value={price}
            placeholder="Prezzo"
            onChange={(e) => setPrice(e.target.value)}
            className="input-number"
          />
        </span>
        <div className="button-container">
          <button className="button update-button" onClick={editProduct}>
            {id ? "Aggiorna" : "Aggiungi"}
          </button>
          {id && (
            <button className="button cancel-button" onClick={deleteProduct}>
              Elimina
            </button>
          )}
          <Link to="/" className="button link-button">
            Annulla
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AlterProduct;
