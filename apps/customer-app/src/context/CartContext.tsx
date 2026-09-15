import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem } from '../types/customer';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  isFreeDelivery: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 35;
const PROMO_DISCOUNT = 50;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items],
  );

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const discount = subtotal > 300 ? PROMO_DISCOUNT : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        isFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
