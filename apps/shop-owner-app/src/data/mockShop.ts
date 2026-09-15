import { ShopInfo, ShopSettings } from '../types/shop';

export const INITIAL_SHOP_INFO: ShopInfo = {
  id: 'SHOP-BLR-001',
  name: 'WeMeat Central Hub — Indiranagar',
  phone: '+91 98450 99881',
  address: '#142, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
  fssaiNumber: 'FSSAI-MOCK-112233440098',
  openingTime: '07:00 AM',
  closingTime: '09:30 PM',
};

export const INITIAL_SHOP_SETTINGS: ShopSettings = {
  soundNotifications: true,
  autoAcceptOrders: false,
  preparationBuffer: 20,
};
