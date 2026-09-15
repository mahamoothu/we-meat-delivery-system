import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <ShopProvider>
          <ProductProvider>
            <OrderProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </OrderProvider>
          </ProductProvider>
        </ShopProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
