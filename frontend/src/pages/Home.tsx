import { useState, useEffect } from "react";
import { getFoodItems } from "../api/client";
import FoodCard from "../components/FoodCard";
import FilterForm from "../components/FilterForm";
import "./Home.css"


interface FoodItem{
    id:number;
    name:string;
    price:number;
    qty:number
    category:string;
    is_available:string;
}

function Home(){
    const [foods,setFoods]=useState<FoodItem[]>([]);
    const [loading, setLoading]=useState(true);
    const [error,setError]=useState("")
    const [filter, setFilter]=useState({category:"",availability:""});
    async function fetchFoods(category?:string,availability?:string) {
            try{
                const data = await getFoodItems(category,availability);
                setFoods(data);
                console.log(data);
            }catch(err:any){
                setError("Failed to load fooditems");
            }finally{
                setLoading(false)
            }
        }
    
    useEffect(()=>{
        fetchFoods();
    },[]);
    function handleFilterChange(newFilters: { category: string; availability: string }) {
    setFilter(newFilters);
    fetchFoods(
        newFilters.category || undefined,
        newFilters.availability || undefined
    );
    }

    function addTocart(item:FoodItem){
        const cart = JSON.parse(localStorage.getItem("cart")||"[]");
        item.qty=1;
        cart.push(item);
        localStorage.setItem("cart",JSON.stringify(cart));
        alert(`${item.name} added to cart`)
    }
    if(loading) return <p>Loadin food items...</p>
    if(error) return <p className="error">{error}</p>

    return(
        <div className="home-container">
            <h2>Food Menu</h2>
            <FilterForm category={filter.category} availability={filter.availability} onFilterChange={handleFilterChange}/>
            <div className="food-grid">
                {foods.map((food)=>(
                    
                    <FoodCard 
                    key={food.id}
                    id={food.id}
                    name={food.name}
                    price={food.price}
                    category={food.category}
                    availability={food.is_available}
                    onAddToCart={()=>addTocart(food)} 
                    />
                ))}
            </div>
        </div>
    );
}
export default Home;