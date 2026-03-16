'use client'

import { createContext, useContext, useState } from 'react'

// Step 1 - Create the context
const CartContext = createContext()

// Step 2 - Create the provider (wraps whole app)
export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([])

  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if product already in cart
      const exists = prev.find(item => item.id === product.id)
      
      if (exists) {
        // If yes → just increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      } else {
        // If no → add new item with qty 1
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Increase quantity
  const increaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  // Decrease quantity
  const decreaseQty = (id) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    )
  }

  // Calculate total price
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.qty)
  }, 0)

  // Total number of items in cart
  const cartCount = cartItems.reduce((count, item) => {
    return count + item.qty
  }, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Step 3 - Custom hook to use cart anywhere
export function useCart() {
  return useContext(CartContext)
}