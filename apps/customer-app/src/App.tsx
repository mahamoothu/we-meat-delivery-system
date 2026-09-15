import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';
import { OrderProvider } from './context/OrderContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <OrderProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </OrderProvider>
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
