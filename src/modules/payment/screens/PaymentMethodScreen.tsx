import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { Button } from "@/src/core/components/Button";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/src/core/constants/theme";

import { EventInfoCard } from "@/src/modules/payment/components/EventInfoCard";
import { TotalAmountCard } from "@/src/modules/payment/components/TotalAmountCard";
import { PaymentMethodCard } from "@/src/modules/payment/components/PaymentMethodCard";
import { getEventDetailById } from "@/src/core/test/eventDetailData";

interface PaymentMethod {
  id: string;
  type: "qr" | "card";
  title: string;
  subtitle: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "qr",
    type: "qr",
    title: "Transferencia Qr Simple",
    subtitle: "Desde cualquier banco",
  },
  {
    id: "card",
    type: "card",
    title: "Tarjeta de débito/crédito",
    subtitle: "Habilitando pagos en línea",
  },
];

export default function PaymentMethodScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();

  // accept forwarded params from Checkout (ticketCount, subtotal, serviceFee, total, selectedTicketId, eventId)
  const total = route.params?.total ?? 0;
  const ticketCount = Number(route.params?.ticketCount) || 1;
  const subtotal = Number(route.params?.subtotal) || 0;
  const serviceFee = Number(route.params?.serviceFee) || 0;
  const selectedTicketId = route.params?.selectedTicketId;
  const eventId = route.params?.eventId;

  const eventData = useMemo(() => (eventId ? getEventDetailById(eventId) : undefined), [eventId]);
  // Prepare event display payload to forward downstream explicitly
  const eventPayload = useMemo(() => ({
    title: eventData?.title ?? "",
    venue: eventData?.location?.name ?? "",
    date: eventData?.date ?? "",
    time: eventData?.time ?? "",
    image: eventData?.image as any,
  }), [eventData]);

  const [selectedMethodId, setSelectedMethodId] = useState<string>("qr");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelect = () => {
    console.log("Selected payment method:", selectedMethodId);
    // Navigate to the appropriate payment flow based on selection
    if (selectedMethodId === "qr") {
      // forward all params so QrSimple and later screens can use them
      (navigation as any).navigate("QrSimple", {
        ticketCount,
        selectedTicketId,
        subtotal,
        serviceFee,
        total,
        eventId,
        methodId: selectedMethodId,
        sector: route.params?.sector,
        eventTitle: eventPayload.title,
        eventVenue: eventPayload.venue,
        eventDate: eventPayload.date,
        eventTime: eventPayload.time,
        eventImage: eventPayload.image,
      });
      return;
    }

    if (selectedMethodId === "card") {
      (navigation as any).navigate("CardPayment", {
        ticketCount,
        selectedTicketId,
        subtotal,
        serviceFee,
        total,
        eventId,
        methodId: selectedMethodId,
        sector: route.params?.sector,
        eventTitle: eventPayload.title,
        eventVenue: eventPayload.venue,
        eventDate: eventPayload.date,
        eventTime: eventPayload.time,
        eventImage: eventPayload.image,
      });
      return;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + Spacing.sm },
        ]}
      >
        <Pressable onPress={handleBack} style={styles.headerButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Método de pago</ThemedText>
        <Pressable style={styles.headerButton}>
          <Feather name="more-vertical" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <EventInfoCard
          imageSource={eventData?.image ?? require("@/src/modules/home/assets/cro-concierto.jpg")}
          title={eventData?.title ?? "Evento"}
          date={eventData?.date ?? ""}
          location={eventData?.location?.name ?? ""}
        />

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Monto Total</ThemedText>
            <TotalAmountCard amount={total} />
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Selecciona tu método de Pago
          </ThemedText>
          <View style={styles.methodsContainer}>
            {PAYMENT_METHODS.map((method) => (
              <PaymentMethodCard
                key={method.id}
                type={method.type}
                title={method.title}
                subtitle={method.subtitle}
                selected={selectedMethodId === method.id}
                onPress={() => setSelectedMethodId(method.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <Button onPress={handleSelect} style={styles.selectButton} textStyle={styles.selectButtonText}>
          SELECCIONAR
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...Typography.h4,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  methodsContainer: {
    gap: Spacing.md,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.light.backgroundRoot,
    alignItems: "center",
  },
  selectButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
