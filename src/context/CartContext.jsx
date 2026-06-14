import { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useRef } from 'react';
import { productAPI } from '../api';

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

const ActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
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
        // Enforce 1-of-1 logic for original artwork
        return state;
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case ActionTypes.REMOVE_ITEM:
      return state.filter((item) => item.id !== action.payload);

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
  const syncedRef = useRef(false);

  const syncCart = useCallback(async () => {
    const currentItems = loadCartFromStorage();
    if (!currentItems || currentItems.length === 0) return;

    try {
      const updatedItems = await Promise.all(
        currentItems.map(async (item) => {
          try {
            const res = await productAPI.getProductById(item.id);
            if (res.data && res.data.success && res.data.product) {
              const product = res.data.product;
              const firstImg = product.images?.[0];
              const imageToUse = (typeof firstImg === 'object' ? firstImg?.url : firstImg) || product.image;
              
              return {
                ...item,
                price: product.price, // Update price
                title: product.title, // Update title
                image: imageToUse,
                artist: product.artist,
                size: product.size,
              };
            }
          } catch (err) {
            console.error(`Failed to sync product ${item.id}`, err);
          }
          return item;
        })
      );
      dispatch({ type: ActionTypes.HYDRATE, payload: updatedItems });
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }, []);

  // Sync cart with backend prices on mount
  useEffect(() => {
    if (!syncedRef.current) {
      syncedRef.current = true;
      syncCart();
    }
  }, [syncCart]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  // ── Actions ────────────────────────────────────────────────────
  const addItem = useCallback(
    (painting) => {
      const firstImg = painting.images?.[0];
      const imageToUse = (typeof firstImg === 'object' ? firstImg?.url : firstImg) || painting.image;

      dispatch({
        type: ActionTypes.ADD_ITEM,
        payload: {
          id: painting._id || painting.id || painting.productId,
          title: painting.title,
          price: painting.price,
          image: imageToUse,
          artist: painting.artist,
          size: painting.size,
        },
      });
    },
    [],
  );

  const removeItem = useCallback(
    (id) => dispatch({ type: ActionTypes.REMOVE_ITEM, payload: id }),
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
      clearCart,
      syncCart,
      total,
      itemCount,
    }),
    [items, addItem, removeItem, clearCart, syncCart, total, itemCount],
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
