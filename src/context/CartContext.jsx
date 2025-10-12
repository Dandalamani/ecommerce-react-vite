import React, { createContext, useContext, useReducer, useEffect } from "react";
// Create the context
const CartContext = createContext();
// Reducer function to handle cart actions
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload.id);
    case "INCREASE_QTY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    case "DECREASE_QTY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}
// Get initial cart from localStorage
const getInitialCart = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};
// Provider component
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
// Custom hook
export function useCart() {
  return useContext(CartContext);
}
