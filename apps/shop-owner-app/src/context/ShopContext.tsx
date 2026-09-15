import React, { createContext, useContext, useState } from 'react';
import { ShopInfo, ShopSettings } from '../types/shop';
import { INITIAL_SHOP_INFO, INITIAL_SHOP_SETTINGS } from '../data/mockShop';

interface ShopContextType {
  shopInfo: ShopInfo;
  isOpen: boolean;
  settings: ShopSettings;
  toggleStoreOpen: () => void;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  updateShopInfo: (newInfo: Partial<ShopInfo>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopInfo, setShopInfo] = useState<ShopInfo>(INITIAL_SHOP_INFO);
  const [isOpen, setIsOpen] = useState(true);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);

  const toggleStoreOpen = () => {
    setIsOpen(prev => !prev);
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateShopInfo = (newInfo: Partial<ShopInfo>) => {
    setShopInfo(prev => ({ ...prev, ...newInfo }));
  };

  return (
    <ShopContext.Provider
      value={{
        shopInfo,
        isOpen,
        settings,
        toggleStoreOpen,
        updateSettings,
        updateShopInfo,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export function useShop(): ShopContextType {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
