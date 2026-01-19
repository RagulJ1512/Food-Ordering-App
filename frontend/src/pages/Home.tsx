import { useState, useEffect } from "react";
import { getFoodItems } from "../api/client";
import FoodCard from "../components/FoodCard";
import FilterForm from "../components/FilterForm";
import "./Home.css";
import { useCart } from "../context/CartContext";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  category: string;
  is_available: string;
}

function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    availability: "",
    min_price: 0,
    max_price: 0,
    search:""
  });
  const { cart, setCart } = useCart();
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
    } finally {
      setLoading(false);
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

  function addToCart(item: FoodItem) {
    const curIndex = cart.findIndex((c) => c.id === item.id);
    let newCart = [...cart];
    if (curIndex !== -1) {
      newCart[curIndex].qty += 1;
    } else {
      newCart.push({ ...item, qty: 1 });
    }
    setCart(newCart);
  }

  if (loading) return <p>Loading food items...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      <h2>Food Menu</h2>
      <FilterForm
        category={filter.category}
        availability={filter.availability}
        min_price={filter.min_price}
        max_price={filter.max_price}
        search={filter.search}
        onFilterChange={handleFilterChange}
      />
      <div className="food-grid">
        {foods.map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            name={food.name}
            price={food.price}
            category={food.category}
            availability={food.is_available}
            onAddToCart={() => addToCart(food)}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
