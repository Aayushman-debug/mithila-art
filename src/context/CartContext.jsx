import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

/* ─── Storage key ──────────────────────────────────────────────── */
const STORAGE_KEY = 'mithilaArt_cart';

/* ─── Helpers ──────────────────────────────────────────────────── */
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/* ─── Action types ─────────────────────────────────────────────── */
const ActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  HYDRATE: 'HYDRATE',
};

/* ─── Reducer ──────────────────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case ActionTypes.HYDRATE:
      return action.payload;

    case ActionTypes.ADD_ITEM: {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case ActionTypes.REMOVE_ITEM:
      return state.filter((item) => item.id !== action.payload);

    case ActionTypes.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((item) => item.id !== id);
      }
      return state.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
    }

    case ActionTypes.CLEAR_CART:
      return [];

    default:
      return state;
  }
}

/* ─── Context ──────────────────────────────────────────────────── */
const CartContext = createContext(null);

/* ─── Provider ─────────────────────────────────────────────────── */
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCartFromStorage);

  // Persist to localStorage on every change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // ── Actions ────────────────────────────────────────────────────
  const addItem = useCallback(
    (painting) =>
      dispatch({
        type: ActionTypes.ADD_ITEM,
        payload: {
          id: painting.id,
          title: painting.title,
          price: painting.price,
          image: painting.images?.[0] || painting.image,
          artist: painting.artist,
          size: painting.size,
        },
      }),
    [],
  );

  const removeItem = useCallback(
    (id) => dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id }),
    [],
  );

  const updateQuantity = useCallback(
    (id, quantity) =>
      dispatch({
        type: ActionTypes.UPDATE_QUANTITY,
        payload: { id, quantity },
      }),
    [],
  );

  const clearCart = useCallback(
    () => dispatch({ type: ActionTypes.CLEAR_CART }),
    [],
  );

  // ── Computed values ────────────────────────────────────────────
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );

  // ── Context value (stable reference) ──────────────────────────
  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, total, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ─── Hook ─────────────────────────────────────────────────────── */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return context;
}

export default CartContext;
