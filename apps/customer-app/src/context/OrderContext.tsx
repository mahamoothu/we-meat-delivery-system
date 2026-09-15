import React, { createContext, useContext, useState, useMemo } from 'react';
import { Order, CartItem, Address, PaymentMethod, OrderStatus } from '../types/customer';
import { MOCK_PRODUCTS } from '../data/mockProducts';

interface PlaceOrderParams {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
}

interface OrderContextType {
  orders: Order[];
  activeOrders: Order[];
  activeOrder: Order | null;
  placeOrder: (params: PlaceOrderParams) => Order;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 'WM982412',
    date: '14 Sep 2026, 07:30 PM',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 }, // Curry cut
      { product: MOCK_PRODUCTS[3], quantity: 1 }, // Leg piece
    ],
    subtotal: 700,
    deliveryFee: 0,
    discount: 50,
    total: 650,
    status: 'DELIVERED',
    deliveryAddress: {
      id: 'addr_home',
      label: 'Home',
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      addressLine: 'Flat 402, Green Meadows Residency, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
    },
    paymentMethod: 'UPI',
    estimatedDelivery: 'Delivered in 28 mins',
    timeline: [
      {
        title: 'Order Placed',
        description: 'Received by WeMeat Central Store',
        timestamp: '07:30 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        title: 'Fresh Cuts Prepared',
        description: 'Cleaned, cut, and sealed in temperature-controlled pack',
        timestamp: '07:38 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        title: 'Out for Delivery',
        description: 'Delivery executive on the way',
        timestamp: '07:46 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        title: 'Delivered',
        description: 'Handed over at doorstep',
        timestamp: '07:58 PM',
        isCompleted: true,
        isCurrent: true,
      },
    ],
  },
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  }, [orders]);

  const placeOrder = (params: PlaceOrderParams): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `WM${randomNum}`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: orderId,
      date: formattedDate,
      items: params.items,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      discount: params.discount,
      total: params.total,
      status: 'PENDING',
      deliveryAddress: params.deliveryAddress,
      paymentMethod: params.paymentMethod,
      estimatedDelivery: 'Arriving in 25–35 mins',
      timeline: [
        {
          title: 'Order Placed',
          description: 'Received by store manager',
          timestamp: 'Just now',
          isCompleted: true,
          isCurrent: true,
        },
        {
          title: 'Meat Cutting & Packing',
          description: 'Hygienic RO-washed custom cuts preparation',
          timestamp: 'Upcoming',
          isCompleted: false,
          isCurrent: false,
        },
        {
          title: 'Dispatched in Insulated Box',
          description: 'Temperature maintained below 4°C',
          timestamp: 'Upcoming',
          isCompleted: false,
          isCurrent: false,
        },
        {
          title: 'Delivered',
          description: 'Doorstep contactless delivery',
          timestamp: 'Upcoming',
          isCompleted: false,
          isCurrent: false,
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(o => o.id === id);
  };

  const cancelOrder = (id: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id
          ? {
              ...o,
              status: 'CANCELLED' as OrderStatus,
              timeline: [
                ...o.timeline,
                {
                  title: 'Cancelled',
                  description: 'Order cancelled by customer',
                  timestamp: 'Just now',
                  isCompleted: true,
                  isCurrent: true,
                },
              ],
            }
          : o,
      ),
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrders,
        activeOrder,
        placeOrder,
        getOrderById,
        cancelOrder,
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
