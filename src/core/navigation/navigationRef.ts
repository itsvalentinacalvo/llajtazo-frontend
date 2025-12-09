import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: { screen?: string } | undefined;
  Home: undefined;
  BurgerMenu: undefined;
  Notifications: undefined;
  EventDetail: { eventId?: number } | undefined;
  Business: { initialAuthRoute?: "LoginBusiness" | "RegisterBusiness" } | undefined;
  PaymentCheckout: undefined;
  PaymentMethod: { total: number } | undefined;
  QrSimple: { total: number } | undefined;
  CardPayment: { total: number } | undefined;
  Success: { ticketId: string } | undefined;
  Error: undefined;
  Result: { ticketId: string; subtotal?: number; serviceFee?: number; total?: number; ticketCount?: number } | undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
