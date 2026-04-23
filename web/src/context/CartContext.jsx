/* eslint-disable react/prop-types */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const CART_STORAGE_KEY = "techlend.cart.items"
const CartContext = createContext(null)

function readStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart())
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item) => {
    if (!item?.id) return false

    let wasAdded = false
    setItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev
      }

      wasAdded = true
      return [...prev, item]
    })

    return wasAdded
  }, [])

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const clearItems = useCallback(() => {
    setItems([])
  }, [])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      items,
      cartCount: items.length,
      isCartOpen,
      addItem,
      removeItem,
      clearItems,
      openCart,
      closeCart,
    }),
    [items, isCartOpen, addItem, removeItem, clearItems, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
