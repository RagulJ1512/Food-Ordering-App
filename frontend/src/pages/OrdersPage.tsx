import { useEffect, useState } from "react";
import { getOrders } from "../api/client";
import OrderCard from "../components/OrderCard";
import "./OrdersPage.css";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  food_id: number;
  food_name: string;
  qty: number;
  unit_price: number;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const navigate=useNavigate();
  if (!role){
   navigate( "/login");
  }
  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-container">
      <h2>{role == "ADMIN" ? "All Orders (Admin)" : "Your Orders"}</h2>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          id={order.id}
          status={order.status}
          total_price={order.total_price}
          items={order.items}
          role={role}
        />
      ))}
    </div>
  );
}
