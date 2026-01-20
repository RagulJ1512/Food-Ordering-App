import "./FoodCard.css";

interface FoodCardProps{
    id:number;
    name:string;
    price:number;
    category:string;
    availability:string;
    onAddToCart:()=>void;
}

function FoodCard( {name,price,category,availability,onAddToCart}:FoodCardProps){
    const isUnavailable = availability === "UNAVAILABLE";
    return(
        
        <div className={`food-card ${isUnavailable ? "disabled" : ""}`}>
            <h3>{name}</h3>
            <p>${price}</p>
            <p>Category:{category}</p>
            <button onClick={onAddToCart} disabled={isUnavailable}>{isUnavailable ? "Out of Stock" : "Add to Cart"}</button>
        </div>
    );

}
export default FoodCard