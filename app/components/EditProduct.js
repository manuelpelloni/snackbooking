import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
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
  const { id } = useParams();
  console.log(id);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);

  const ref = useRef();
  const ref1 = useRef();
  const ref2 = useRef();
  const focused = useFocus(ref);
  const focused1 = useFocus(ref1);
  const focused2 = useFocus(ref2);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", `/api/products/${id}`).then((response) => {
      if (isSubscribed) {
        setName(response.name);
        setDescription(response.description);
        setPrice(response.price);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  return (
    <div className="AlterProduct">
      <div className="container">
        <span className="form-title">{}</span>
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
        <button className="form-button">{id ? "Aggiorna" : "Aggiungi"}</button>
        {id && <button className="form-button">Elimina</button>}
        <Link to="/">Annulla</Link>
      </div>
    </div>
  );
};
export default AlterProduct;
