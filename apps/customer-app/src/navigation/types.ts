import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Categories: { selectedCategory?: string } | undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  AddressSelection: { fromCheckout?: boolean } | undefined;
  OrderSummary: undefined;
  OrderSuccess: { orderId: string };
  OrderDetails: { orderId: string };
  Settings: undefined;
};
