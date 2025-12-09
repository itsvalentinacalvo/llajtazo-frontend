import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { Button } from "@/src/core/components/Button";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "@/src/core/constants/theme";

import { TicketCounter } from "../components/TicketCounter";
import { SectorCard } from "../components/SectorCard";
import { PriceSummary } from "../components/PriceSummary";
import { EventInfoCard } from "../components/EventInfoCard";

type PaymentCheckoutRouteProp = RouteProp<
  { PaymentCheckout: { selectedTicketId?: string | null; eventId?: string } },
  "PaymentCheckout"
>;

interface Sector {
  id: string;
  name: string;
  price: number;
  soldOut: boolean;
}

const SECTORS: Sector[] = [
  { id: "rockstar", name: "ROCKSTAR", price: 150, soldOut: true },
  { id: "campo", name: "CAMPO", price: 200, soldOut: false },
  { id: "terraza", name: "TERRAZA", price: 250, soldOut: false },
];

const SERVICE_FEE_PERCENTAGE = 0.04;

export default function PaymentCheckoutScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<PaymentCheckoutRouteProp>();

  const selectedTicketId = route.params?.selectedTicketId;
  const eventId = route.params?.eventId;

  // Extract sector name from ticket ID (e.g., "ticket-campo" -> "campo")
  const getInitialSectorId = () => {
    if (selectedTicketId) {
      const sectorName = selectedTicketId.split("-")[1]; // "ticket-campo" -> "campo"
      const sector = SECTORS.find((s) => s.id === sectorName);
      if (sector && !sector.soldOut) {
        return sectorName;
      }
    }
    return "campo"; // default fallback
  };

  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSectorId, setSelectedSectorId] = useState<string>(getInitialSectorId());

  const selectedSector = SECTORS.find((s) => s.id === selectedSectorId);
  const subtotal = selectedSector ? selectedSector.price * ticketCount : 0;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENTAGE * 100) / 100;
  const total = subtotal + serviceFee;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = () => {
    // Pass all relevant payment params forward so downstream screens can use them
    (navigation as any).navigate("PaymentMethod", {
      ticketCount,
      selectedTicketId,
      subtotal,
      serviceFee,
      total,
    });
  };

  const handleSelectSector = (sectorId: string) => {
    const sector = SECTORS.find((s) => s.id === sectorId);
    if (sector && !sector.soldOut) {
      setSelectedSectorId(sectorId);
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
        <ThemedText style={styles.headerTitle}>Compra de Tickets</ThemedText>
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
          imageSource={require("@/src/modules/home/assets/cro-concierto.jpg")}
          title="C.R.O en Concierto"
          date="11 de Abril, 2025"
          location="Alice Park"
        />

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Numero de Tickets</ThemedText>
          <TicketCounter
            count={ticketCount}
            onIncrement={() => setTicketCount((c) => c + 1)}
            onDecrement={() => setTicketCount((c) => Math.max(1, c - 1))}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Sectores Disponibles</ThemedText>
          <View style={styles.sectorsContainer}>
            {SECTORS.map((sector) => (
              <SectorCard
                key={sector.id}
                name={sector.name}
                price={sector.price}
                soldOut={sector.soldOut}
                selected={selectedSectorId === sector.id}
                onPress={() => handleSelectSector(sector.id)}
              />
            ))}
          </View>
        </View>

        <PriceSummary
          subtotal={subtotal}
          serviceFee={serviceFee}
          total={total}
        />
      </ScrollView>

      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <Button onPress={handleConfirm} style={styles.confirmButton} textStyle={styles.confirmButtonText}>
          CONFIRMAR TICKETS
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
  sectorsContainer: {
    gap: Spacing.sm,
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
  confirmButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
