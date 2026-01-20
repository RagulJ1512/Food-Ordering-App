import { updateOrderStatus } from "../api/client";
import "./OrderCard.css";

interface OrderItem {
  food_id: number;
  food_name: string;
  qty: number;
  unit_price: number;
}

interface OrderCardProps {
  id: number;
  status: string;
  total_price: number;
  items: OrderItem[];
  role?: string; 
}

export default function OrderCard({ id, status, total_price, items}: OrderCardProps) {
  const role = localStorage.getItem('role');
  async function handleStatusChange(newStatus: string) {
    try {
      await updateOrderStatus(id, newStatus);
      alert(`Order #${id} status updated to ${newStatus}`);
      
    } catch (err: any) {
      alert("Failed to update order status.");
    }
  }

  return (
    <div className="order-card">
      <h3>Order: #{id}</h3>
      <p>Status: {status}</p>
      <p>Total: ₹{total_price}</p>
      <details className="food-items">
        <summary>View Items</summary>
        <ul className="food-items">
          {items.map((item, idx) => (
            <li key={idx}>
              {item.food_name} (x{item.qty}) - ₹{item.unit_price}
            </li>
          ))}
        </ul>
      </details>

      {role=="ADMIN" && (
        <div className="admin-controls">
          <label>Change Status: </label>
          <select onChange={(e) => handleStatusChange(e.target.value)} defaultValue={status}>
            <option value="" disabled>Select status</option>
            <option value="PLACED">Placed</option>
            <option value="PREPARING">Preparing</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      )}
    </div>
  );
}
