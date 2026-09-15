import React, { createContext, useContext, useState } from 'react';
import { Address } from '../types/customer';

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  selectAddress: (id: string) => void;
  deleteAddress: (id: string) => void;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr_home',
    label: 'Home',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine: 'Flat 402, Green Meadows Residency, Outer Ring Road',
    landmark: 'Opposite Central Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
    isDefault: true,
  },
  {
    id: 'addr_work',
    label: 'Work',
    name: 'Rahul Sharma (Office)',
    phone: '+91 98765 43210',
    addressLine: '7th Floor, Tech Hub Tower 2, Whitefield',
    landmark: 'Near Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560066',
    isDefault: false,
  },
];

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(INITIAL_ADDRESSES[0]);

  const addAddress = (newAddr: Omit<Address, 'id'>): Address => {
    const created: Address = {
      ...newAddr,
      id: `addr_${Date.now()}`,
    };
    setAddresses(prev => [created, ...prev]);
    setSelectedAddress(created);
    return created;
  };

  const selectAddress = (id: string) => {
    const found = addresses.find(a => a.id === id);
    if (found) {
      setSelectedAddress(found);
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) {
      const remaining = addresses.filter(a => a.id !== id);
      setSelectedAddress(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        addAddress,
        selectAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export function useAddress(): AddressContextType {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
