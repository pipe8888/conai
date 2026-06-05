import { createContext, useContext, useReducer, useState } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.payload.id)
      const items = existing
        ? state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, { ...action.payload, quantity: 1 }]
      return {
        items,
        count: state.count + 1,
        total: parseFloat((state.total + action.payload.price).toFixed(2)),
      }
    }
    case 'REMOVE': {
      const item = state.items.find(i => i.id === action.payload)
      if (!item) return state
      return {
        items: state.items.filter(i => i.id !== action.payload),
        count: state.count - item.quantity,
        total: parseFloat((state.total - item.price * item.quantity).toFixed(2)),
      }
    }
    case 'UPDATE': {
      const item = state.items.find(i => i.id === action.payload.id)
      if (!item) return state
      if (action.payload.qty <= 0) {
        return {
          items: state.items.filter(i => i.id !== action.payload.id),
          count: state.count - item.quantity,
          total: parseFloat((state.total - item.price * item.quantity).toFixed(2)),
        }
      }
      const diff = action.payload.qty - item.quantity
      return {
        items: state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i),
        count: state.count + diff,
        total: parseFloat((state.total + item.price * diff).toFixed(2)),
      }
    }
    case 'CLEAR':
      return { items: [], count: 0, total: 0 }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], count: 0, total: 0 })
  const [drawerOpen, setDrawerOpen] = useState(false)

  const addToCart = (product) => {
    dispatch({ type: 'ADD', payload: product })
    setDrawerOpen(true)
  }
  const removeFromCart = (id) => dispatch({ type: 'REMOVE', payload: id })
  const updateQuantity = (id, qty) => dispatch({ type: 'UPDATE', payload: { id, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR' })
  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart, drawerOpen, openDrawer, closeDrawer }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
