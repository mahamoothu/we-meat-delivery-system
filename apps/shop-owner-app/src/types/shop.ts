/**
 * Shop Owner App Domain Types
 */

export type ShopOrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export type ProductCategory = 'All' | 'Curry Cut' | 'Boneless' | 'Specialty' | 'Whole Chicken';

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  weight: string;
  pieces?: string;
  serves?: string;
  cookingTime?: string;
  isAvailable: boolean;
  isBestseller?: boolean;
  imageUrl?: string;
}

export interface ProductFormData {
  name: string;
  tagline?: string;
  description: string;
  category: ProductCategory;
  price: string;
  weight: string;
  pieces?: string;
  serves?: string;
  cookingTime?: string;
  isAvailable: boolean;
}

export interface ShopOrderItem {
  product: Product;
  quantity: number;
  specialInstructions?: string;
}

export type PaymentMethod = 'Cash on Delivery' | 'UPI' | 'Card';

export interface ShopOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: ShopOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: ShopOrderStatus;
  createdAt: string;
  specialInstructions?: string;
  rejectionReason?: string;
}

export interface ShopInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
  fssaiNumber: string;
  openingTime: string;
  closingTime: string;
}

export interface ShopSettings {
  soundNotifications: boolean;
  autoAcceptOrders: boolean;
  preparationBuffer: 15 | 20 | 30;
}

export interface DashboardStats {
  todayOrdersCount: number;
  todayRevenue: number;
  pendingOrdersCount: number;
  activeProductsCount: number;
  outOfStockCount: number;
}

export interface ShopOwnerUser {
  id: string;
  name: string;
  phoneNumber: string;
  storeId: string;
  role: 'SHOP_OWNER';
}
