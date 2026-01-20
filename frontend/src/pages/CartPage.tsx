import { useEffect, useState, } from "react";
import { placeOrder } from "../api/client";
import CartItem from "../components/CartItem";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


export default function CartPage() {
  const {cart, setCart} = useCart();
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  if (!role) {
    navigate("/login");
  }
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  function removeItem(index: number) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }

  function increaseQty(index: number) {
    const newCart = [...cart];
    newCart[index].qty += 1;
    setCart(newCart);
  }
  function decreaseQty(index: number) {
    const newCart = [...cart];
    if (newCart[index].qty<=1){
      removeItem(index);
    }else{
      newCart[index].qty -= 1;
      setCart(newCart);

    }
  
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
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
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
      <div className="checkout-cnt">

      <h3 className="total-price">Total: ₹{totalPrice}</h3>
      <button className="checkout-btn" onClick={checkout}>
        Checkout
      </button>
      </div>
    </div>
  );
}
