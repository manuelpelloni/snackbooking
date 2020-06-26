import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faEdit } from "@fortawesome/free-solid-svg-icons";
//import { EuroCircleOutlined, InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import "././forms/Forms.css";
import "./EditProduct.css";

import request from "../utils/http";
const useFocus = (ref, defaultState = false) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = () => setState(false);
    const current = ref.current;
    current.addEventListener("focus", onFocus);
    current.addEventListener("blur", onBlur);

    return () => {
      current.removeEventListener("focus", onFocus);
      current.removeEventListener("blur", onBlur);
    };
  }, [ref]);

  return state;
};

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
            <FontAwesomeIcon icon={faEdit} className="icon-size" />
          </span>
          <input
            ref={ref}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-text"
          />
        </span>
        <span
          className={`input-wrapper ${focused1 && "input-wrapper-focused"}`}
        >
          <span className="input-prefix">
            <FontAwesomeIcon icon={faEdit} className="icon-size" />
          </span>
          <input
            ref={ref1}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-text"
          />
        </span>
        <span
          className={`input-wrapper ${focused2 && "input-wrapper-focused"}`}
        >
          <span className="input-prefix">
            <FontAwesomeIcon icon={faEuroSign} className="icon-size" />
          </span>
          <input
            ref={ref2}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-number"
          />
        </span>
        <button className="button update-button" onClick={editProduct}>
          {id ? "Aggiorna" : "Aggiungi"}
        </button>
        {id && (
          <button className="button cancel-button" onClick={deleteProduct}>
            Elimina
          </button>
        )}
        <p>
          <Link to="/">Annulla</Link>
        </p>
      </div>
    </div>
  );
};
export default AlterProduct;
