import { useEffect, useState } from "react";
import { getFoodItems, addFoodItems } from "../api/client";
import AdminFoodCard from "../components/AdminFoodCard";
import "./AdminDashboard.css";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  availability: string;
}

export default function AdminDashboard() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState({ name: "", price: 0, category: "", availability: "AVAILABLE" });

  async function fetchFoods() {
    const data = await getFoodItems();
    setFoods(data);
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  async function handleAddFood() {
    await addFoodItems(newFood);
    setNewFood({ name: "", price: 0, category: "", availability: "AVAILABLE" });
    fetchFoods();
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="add-food-form">
        <h3>Add New Food</h3>
        <input
          type="text"
          placeholder="Name"
          value={newFood.name}
          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newFood.price}
          onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })}
        />
        <select
          value={newFood.category}
          onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="STARTER">Starter</option>
          <option value="MAIN_COURSE">Main Course</option>
          <option value="DESSERT">Dessert</option>
          <option value="DRINK">Drink</option>
        </select>
        <button onClick={handleAddFood}>Add Food</button>
      </div>

      <h3>Food Items</h3>
      <div className="food-card-grid">
        {foods.map((food) => (
          <AdminFoodCard key={food.id} food={food} onRefresh={fetchFoods} />
        ))}
      </div>
    </div>
  );
}
