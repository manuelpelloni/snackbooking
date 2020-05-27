import { React, useEffect } from "react";
import "./Cart.css";
import Navbar from "./Navbar";
import request from "../../utils/http";

const Cart = () => {
  const [items, setitems] = useState([]);

  async function fetchItems() {
    const response = await request("GET", "api/orders");
    const data = await response.json();
    setitems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const components = [];
  for (const item of items) {
    components.push(<CartItem key={item.id} product={item} />);
  }

  return (
    <div className="Cart">
      <div className="items-container "></div>
      <Navbar />
    </div>
  );
};

export default Cart;
