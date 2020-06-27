import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import Product from "./Product";
import Navbar from "./Navbar";

import request from "../utils/http";

const Home = () => {
  const [products, setProducts] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "/api/products").then((response) => {
      if (isSubscribed) {
        setProducts(response.products);
        setAdmin(response.admin);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (products === null || admin === null) return <Navbar />;

  const components = [];

  for (const item of products) {
    components.push(<Product key={item.id} product={item} admin={admin} />);
  }

  return (
    <div className="Home">
      <div className="products-container ">
        {components}
        {admin && (
          <Link to="/product/new" className="new-product">
            <FontAwesomeIcon icon={faPlus} className="new-product-icon" />
          </Link>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
