import { useEffect, useState } from "react";
import { placeOrder } from "../api/client";
import CartItem from "../components/CartItem";
import "./CartPage.css";

interface FoodItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  category: string;
  availability: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<FoodItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  function updateCart(newCart:FoodItem[]){
    setCart(newCart);
    localStorage.setItem("cart",JSON.stringify(newCart))
  }
  function removeItem(index:number){
    const newCart = [...cart];
    newCart.splice(index,1);
    updateCart(newCart)
  }
  
  function increaseQty(index:number){
    const newCart =[...cart];
    newCart[index].qty+= 1;
    updateCart(newCart);
  }
  function decreaseQty(index:number){
    const newCart =[...cart];
    newCart[index].qty-= 1;
    updateCart(newCart);
  }
  
  async function checkout() {
    try {
      const orderData = {
        items: cart.map((item) => ({
          food_id: item.id,
          qty: item.qty, 
        })),
      };
      await placeOrder(orderData);
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (err: any) {
      alert("Failed to place order.");
    }
  }

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cart.map((item, index) => (
          <CartItem
            key={index}
            name={item.name}
            price={item.price}
            qty={item.qty}
            onRemove={() => removeItem(index)}
            onIncrease={() => increaseQty(index)}
            onDecrease={() => decreaseQty(index)}
          />
        ))}
      </ul>
      <button className="checkout-btn" onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}
