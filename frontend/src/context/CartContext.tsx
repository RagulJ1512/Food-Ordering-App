import { createContext, useContext, useState, type ReactNode } from "react";

interface FoodItem { 
    id: number; 
    name: string; 
    price: number; 
    qty: number; 
    category: string; 
    is_available: string; 
} 
interface CartContextType { 
    cart: FoodItem[]; 
    setCart: (newCart: FoodItem[]) => void; 
}
const CartContext=createContext<CartContextType | undefined>(undefined);


export function CartProvider({children}:{children:ReactNode}){
    const [cartState,_setCartState] = useState<FoodItem[]>(()=>
        JSON.parse(localStorage.getItem("cart")||"[]")
    );
    function setCart(newCart:FoodItem[]){
        _setCartState(newCart);
        localStorage.setItem("cart",JSON.stringify(newCart));
    }
    
    return(
        <CartContext.Provider value={{cart:cartState,setCart}}>
        {children}
        </CartContext.Provider>
    );
}

export function useCart(){
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useCart must be used within a CartProvider");

    }
    return context
}