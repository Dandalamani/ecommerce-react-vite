import React, { createContext, useContext, useReducer, useEffect } from "react";
const WishlistContext = createContext();

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      // Avoid duplicates
      if (state.find((item) => item.id === action.payload.id)) return state;
      return [...state, action.payload];
    case "REMOVE_FROM_WISHLIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_WISHLIST":
      return [];
    default:
      return state;
  }
}

// Get initial wishlist from localStorage
const getInitialWishlist = () => {
  const savedWishlist = localStorage.getItem("wishlist");
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};
export function WishlistProvider({ children }) {
  const [wishlist, dispatchWishlist] = useReducer(
    wishlistReducer,
    [],
    getInitialWishlist
  );
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  return (
    <WishlistContext.Provider value={{ wishlist, dispatchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
// Custom hook
export function useWishlist() {
  return useContext(WishlistContext);
}