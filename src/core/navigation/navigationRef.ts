import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: { screen?: string } | undefined;
  Home: undefined;
  BurgerMenu: undefined;
  Notifications: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
