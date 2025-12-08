// src/modules/menu/navigation/MenuNavigator.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyTicketsScreen from "@/src/modules/menu/screens/MyTicketsScreen";
import TicketDetailsScreen from "@/src/modules/menu/screens/TicketDetailsScreen";

export type MenuStackParamList = {
  Tickets: undefined;
  // ticketCount added so details screen can render multiple tickets
  TicketDetails: { ticketId: string; ticketCount?: number };
};

const Stack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tickets" component={MyTicketsScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    </Stack.Navigator>
  );
}
