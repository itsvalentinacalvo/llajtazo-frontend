import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PaymentCheckoutScreen from "@/src/modules/payment/screens/PaymentCheckoutScreen";
import PaymentMethodScreen from "@/src/modules/payment/screens/PaymentMethodScreen";
import PaymentQrSimpleScreen from "@/src/modules/payment/screens/PaymentQrSimpleScreen";
import PaymentCardScreen from "@/src/modules/payment/screens/PaymentCardScreen";
import PaymentSuccessScreen from "@/src/modules/payment/screens/PaymentSuccessScreen";
import PaymentErrorScreen from "@/src/modules/payment/screens/PaymentErrorScreen";
import PaymentResultScreen from "@/src/modules/payment/screens/PaymentResultScreen";


export type PaymentStackParamList = {
  Checkout: undefined;
  Method: { total: number };
  QrSimple: { total: number };
  CardPayment: { total: number };
  Success: { ticketId: string };
  Error: undefined;
  Result: { ticketId: string };
};

const Stack = createNativeStackNavigator<PaymentStackParamList>();

export default function PaymentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Checkout" component={PaymentCheckoutScreen} />
      <Stack.Screen name="Method" component={PaymentMethodScreen} />
      <Stack.Screen name="QrSimple" component={PaymentQrSimpleScreen} />
      <Stack.Screen name="CardPayment" component={PaymentCardScreen} />
      <Stack.Screen name="Success" component={PaymentSuccessScreen} />
      <Stack.Screen name="Error" component={PaymentErrorScreen} />
      <Stack.Screen name="Result" component={PaymentResultScreen} />
    </Stack.Navigator>
  );
}
