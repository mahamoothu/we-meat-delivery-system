import { NavigatorScreenParams } from '@react-navigation/native';
import { ShopOrderStatus } from '../types/shop';

export type MainTabParamList = {
  Dashboard: undefined;
  Orders: { initialStatus?: ShopOrderStatus } | undefined;
  Products: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerification: { phoneNumber: string };
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  OrderDetails: { orderId: string };
  AddProduct: undefined;
  EditProduct: { productId: string };
  Settings: undefined;
};
