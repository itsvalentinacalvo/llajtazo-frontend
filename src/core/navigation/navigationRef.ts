import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: { screen?: string } | undefined;
  Home: undefined;
  BurgerMenu: undefined;
  Notifications: undefined;
  EventDetail: { eventId?: number } | undefined;
  Business: { initialAuthRoute?: "LoginBusiness" | "RegisterBusiness" } | undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
