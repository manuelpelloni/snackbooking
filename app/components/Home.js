import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Product from "./Product";
import Navbar from "./Navbar";
import request from "../utils/http";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    request("GET", "/api/products", navigate).then((response) => {
      if (isSubscribed) setProducts(response);
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (products === null) return <Navbar />;

  const components = [];
  for (const item of products) {
    components.push(
      <Product key={item.id} product={item} redirectTo={navigate} />
    );
  }

  return (
    <div className="Home">
      <div className="products-container ">{components}</div>
      <Navbar />
    </div>
  );
};

export default Home;
