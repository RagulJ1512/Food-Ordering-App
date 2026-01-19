import { useEffect, useState } from "react";
import { getFoodItems, addFoodItems } from "../api/client";
import AdminFoodCard from "../components/AdminFoodCard";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import FilterForm from "../components/FilterForm";

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
  const [error,setError]=useState("");
  const [filter, setFilter] = useState({
    category: "",
    availability: "",
    min_price: 0,
    max_price: 0,
    search:""
  });
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  if (role!="ADMIN") {
    navigate("/login");
  }
  async function fetchFoods(
    category?: string,
    availability?: string,
    min_price?: number,
    max_price?: number,
    search?:string,
  ) {
    try {
      const data = await getFoodItems(
        category,
        availability,
        min_price,
        max_price,
      );
      setFoods(data);
    } catch (err: any) {
      setError("Failed to load fooditems");
    } 
    let filtered = [...foods];
    if (search) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFoods(filtered);
    }
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  async function handleAddFood() {
    await addFoodItems(newFood);
    setNewFood({ name: "", price: 0, category: "", availability: "AVAILABLE" });
    fetchFoods();
  }
  function handleFilterChange(newFilters: {
    category: string;
    availability: string;
    min_price: number;
    max_price: number;
    search: string;
  }) {
    setFilter(newFilters);
    fetchFoods(
      newFilters.category || undefined,
      newFilters.availability || undefined,
      newFilters.min_price || undefined,
      newFilters.max_price || undefined,
      newFilters.search||undefined,
    );
    
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
      <FilterForm
        category={filter.category}
        availability={filter.availability}
        min_price={filter.min_price}
        max_price={filter.max_price}
        search={filter.search}
        onFilterChange={handleFilterChange}
      />
      <div className="food-card-grid">
        {foods.map((food) => (
          <AdminFoodCard key={food.id} food={food} onRefresh={fetchFoods} />
        ))}
      </div>
    </div>
  );
}
