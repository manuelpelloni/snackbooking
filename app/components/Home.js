import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Product from "./Product";
import Navbar from "./Navbar";
import request from "../utils/http";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [redirect, setRedirect] = useState();

  async function fetchProducts() {
    const response = await request("GET", "/api/products", navigate);

    setRedirect(response.redirect);
    setProducts(response);
  }

  useEffect(() => {
    fetchProducts();
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
