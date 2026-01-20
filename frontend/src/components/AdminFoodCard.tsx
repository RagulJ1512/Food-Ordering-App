import { useState } from "react";
import { updateFoodItem, updateFoodAvailabl, deleteFoodItem } from "../api/client";
import "./AdminFoodCard.css";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  category: string;
  availability: string;
}

interface AdminFoodCardProps {
  food: FoodItem;
  onRefresh: () => void;
}

export default function AdminFoodCard({ food, onRefresh }: AdminFoodCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFood, setEditedFood] = useState(food);
  const [error, setError] = useState("");

  async function handleAvailabilityChange(newStatus: string) {
    try {
      await updateFoodAvailabl(food.id, newStatus);
      onRefresh();
    } catch (e) {
      setError("Failed to update availability");
    }
  }

  async function handleSave() {
    try {
      await updateFoodItem(food.id, editedFood);
      setIsEditing(false);
      onRefresh();
    } catch (e) {
      setError("Failed to save changes");
    }
  }

  async function handleDelete() {
    try {
      await deleteFoodItem(food.id);
      onRefresh();
    } catch (e) {
      setError("Food Item cannot be deleted");
    }
  }

  return (
    <div className="admin-food-card">
      {!isEditing ? (
        <>
          <h3>{food.name}</h3>
          <p>₹{food.price}</p>
          <p>Category: {food.category}</p>
          <label>
            Availability:
            <select
              value={food.availability}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              defaultValue={food.availability}
            >
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </label>
          <div className="card-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="del-btn" onClick={handleDelete}>Delete</button>
          </div>
          {error && <p className="error">{error}</p>}
        </>
      ) : (
        <>
          <input
            type="text"
            value={editedFood.name}
            onChange={(e) => setEditedFood({ ...editedFood, name: e.target.value })}
          />
          <input
            type="number"
            value={editedFood.price}
            onChange={(e) => setEditedFood({ ...editedFood, price: Number(e.target.value) })}
          />
          <select
            value={editedFood.category}
            onChange={(e) => setEditedFood({ ...editedFood, category: e.target.value })}
          >
            <option value="STARTER">Starter</option>
            <option value="MAIN_COURSE">Main Course</option>
            <option value="DESSERT">Dessert</option>
            <option value="DRINK">Drink</option>
          </select>
          <div className="edit-actions">
            <button className="edit-btn" onClick={handleSave}>Save</button>
            <button className="del-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
}
