import React from "react";
import "./CartItem.css";

interface CartItemProps {
  name: string;
  price: number;
  qty:number;
  onRemove: () => void;
  onIncrease:()=> void;
  onDecrease:()=> void;
}

export default function CartItem({ name, price, qty,onRemove,onIncrease,onDecrease }: CartItemProps) {
  return (
    <li className="cart-item">
      <span>{name} - ₹{price}x{qty} = ₹{price * qty}</span>
      <div className="cart-action">
        <button onClick={onDecrease} disabled={qty<=1}>-</button>
        <button onClick={onIncrease}>+</button>
        <button onClick={onRemove}>Remove</button>
      </div>
    </li>
  );
}
