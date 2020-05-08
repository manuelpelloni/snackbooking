import React, { useState, useEffect } from "react";
import "./Home.css";
import Product from "./Product";

const Home = () => {
  const [products, setProducts] = useState([]);

  async function fetchProducts() {
    const rensponse = await fetch("/api/products", {
      methode: "GET",
      credsentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
    const data = await rensponse.json();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const components = [];
  for (const item of products) {
    components.push(<Product key={item.id} product={item} />);
  }

  return <div className="Home">{components}</div>;
};

export default Home;