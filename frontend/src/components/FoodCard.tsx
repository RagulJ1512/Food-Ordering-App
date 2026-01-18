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
 
    return(
        
        <div className="food-card">
            <h3>{name}</h3>
            <p>${price}</p>
            <p>Category:{category}</p>
            <p>Status:{availability}</p>
            <button onClick={onAddToCart}>Add to Cart</button>
        </div>
    );

}
export default FoodCard