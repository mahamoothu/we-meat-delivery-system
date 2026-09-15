/**
 * Customer Domain Types
 */

export type OrderStatus =
  'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Card';

export type ProductCategory = 'All' | 'Curry Cut' | 'Boneless' | 'Specialty' | 'Whole Chicken';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  weight: string;
  pieces?: string;
  serves?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isBestseller?: boolean;
  badgeText?: string;
  cookingTime?: string;
}

export interface CategoryItem {
  id: string;
  name: ProductCategory;
  icon: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  name: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface OrderTimelineStep {
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  estimatedDelivery: string;
  timeline: OrderTimelineStep[];
}

export interface CustomerUser {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
}
