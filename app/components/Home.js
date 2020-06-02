import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Product from "./Product";
import Navbar from "./Navbar";
import request from "../utils/http";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);

  async function fetchProducts() {
    const rensponse = await request("GET", "/api/products");
    const data = await rensponse.json();

    if (data.redirect) return navigate("/login");

    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (products === null) return null;

  const components = [];
  for (const item of products) {
    components.push(<Product key={item.id} product={item} />);
  }

  return (
    <div className="Home">
      <div className="products-container ">{components}</div>
      <Navbar />
    </div>
  );
};

export default Home;
