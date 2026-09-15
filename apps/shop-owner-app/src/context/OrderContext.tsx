import React, { createContext, useContext, useState, useMemo } from 'react';
import { ShopOrder, ShopOrderStatus, DashboardStats } from '../types/shop';
import { INITIAL_ORDERS } from '../data/mockOrders';

interface OrderContextType {
  orders: ShopOrder[];
  pendingOrders: ShopOrder[];
  activeOrders: ShopOrder[];
  getOrderById: (id: string) => ShopOrder | undefined;
  updateOrderStatus: (
    id: string,
    newStatus: ShopOrderStatus,
  ) => { success: boolean; error?: string };
  rejectOrder: (id: string, reason?: string) => { success: boolean; error?: string };
  stats: DashboardStats;
  getNextAllowedStatus: (currentStatus: ShopOrderStatus) => ShopOrderStatus | null;
}

const VALID_TRANSITIONS: Record<ShopOrderStatus, ShopOrderStatus[]> = {
  PENDING: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['PREPARING'],
  PREPARING: ['READY'],
  READY: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  REJECTED: [],
  CANCELLED: [],
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<ShopOrder[]>(INITIAL_ORDERS);

  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'PENDING');
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter(
      o => o.status !== 'DELIVERED' && o.status !== 'REJECTED' && o.status !== 'CANCELLED',
    );
  }, [orders]);

  const stats: DashboardStats = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'REJECTED' && o.status !== 'CANCELLED');
    const todayRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      todayOrdersCount: validOrders.length,
      todayRevenue,
      pendingOrdersCount: pendingOrders.length,
      activeProductsCount: 7, // Default synced in UI
      outOfStockCount: 1,
    };
  }, [orders, pendingOrders]);

  const getOrderById = (id: string): ShopOrder | undefined => {
    return orders.find(o => o.id === id);
  };

  const getNextAllowedStatus = (currentStatus: ShopOrderStatus): ShopOrderStatus | null => {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || allowed.length === 0) return null;
    // Return primary next stage (e.g. ACCEPTED for PENDING, PREPARING for ACCEPTED)
    return allowed[0];
  };

  const updateOrderStatus = (
    id: string,
    newStatus: ShopOrderStatus,
  ): { success: boolean; error?: string } => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const allowedTransitions = VALID_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Cannot transition order from "${order.status}" to "${newStatus}".`,
      };
    }

    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)));

    return { success: true };
  };

  const rejectOrder = (id: string, reason?: string): { success: boolean; error?: string } => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status !== 'PENDING') {
      return {
        success: false,
        error: `Only PENDING orders can be rejected. Current status is ${order.status}.`,
      };
    }

    setOrders(prev =>
      prev.map(o =>
        o.id === id
          ? {
              ...o,
              status: 'REJECTED',
              rejectionReason: reason?.trim() || 'Store unable to fulfill this order currently.',
            }
          : o,
      ),
    );

    return { success: true };
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        pendingOrders,
        activeOrders,
        getOrderById,
        updateOrderStatus,
        rejectOrder,
        stats,
        getNextAllowedStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrder(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export const useOrders = useOrder;
