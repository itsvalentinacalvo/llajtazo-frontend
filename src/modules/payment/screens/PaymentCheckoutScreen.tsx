import React, { useMemo, useState } from "react";
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
import { getEventDetailById } from "@/src/core/test/eventDetailData";

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

const SERVICE_FEE_PERCENTAGE = 0.04;

export default function PaymentCheckoutScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<PaymentCheckoutRouteProp>();

  const selectedTicketId = route.params?.selectedTicketId;
  const eventId = route.params?.eventId;

  // Load event detail from test database to inherit event info and tickets/sectors
  const eventData = useMemo(() => (eventId ? getEventDetailById(eventId) : undefined), [eventId]);

  // Derive sectors from event data (prefer explicit sectors, fallback to tickets)
  const sectors: Sector[] = useMemo(() => {
    const list: Sector[] = [];
    if (eventData && Array.isArray(eventData.sectors) && eventData.sectors.length > 0) {
      for (const s of eventData.sectors as any[]) {
        list.push({
          id: String((s.id ?? s.name ?? Math.random()).toString()),
          name: String(s.name ?? s.label ?? "SECTOR"),
          price: Number(s.price ?? s.amount ?? 0),
          soldOut: Boolean(s.isSoldOut ?? s.soldOut ?? false),
        });
      }
    } else if (eventData && Array.isArray(eventData.tickets) && eventData.tickets.length > 0) {
      // Group tickets by type/sector name to approximate sectors
      for (const t of eventData.tickets as any[]) {
        const id = String(t.sectorId ?? t.type ?? t.name ?? t.id ?? Math.random());
        const existing = list.find((s) => s.id === id);
        const price = Number(t.price ?? t.amount ?? 0);
        const soldOut = Boolean(t.isSoldOut ?? !t.available);
        const name = String(t.type ?? t.name ?? "SECTOR");
        if (!existing) {
          list.push({ id, name, price, soldOut });
        } else {
          // If multiple tickets map to same sector, take min price, and soldOut only if all are sold out
          existing.price = existing.price ? Math.min(existing.price, price) : price;
          existing.soldOut = existing.soldOut && soldOut;
        }
      }
    }
    return list;
  }, [eventData]);

  // Choose initial sector: try to match selected ticket to sector; otherwise first available
  const getInitialSectorId = () => {
    if (selectedTicketId && eventData && Array.isArray(eventData.tickets)) {
      const t = (eventData.tickets as any[]).find((tk) => String(tk.id) === String(selectedTicketId));
      if (t) {
        const matchId = String(t.sectorId ?? t.type ?? t.name ?? "");
        const sector = sectors.find((s) => s.id === matchId);
        if (sector && !sector.soldOut) return matchId;
      }
    }
    const firstAvailable = sectors.find((s) => !s.soldOut);
    return firstAvailable ? firstAvailable.id : (sectors[0]?.id ?? "");
  };

  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSectorId, setSelectedSectorId] = useState<string>(getInitialSectorId());

  const selectedSector = sectors.find((s) => s.id === selectedSectorId);
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
      eventId,
      // include chosen sector name so downstream screens can persist it
      sector: selectedSector?.name ?? selectedSectorId,
    });
  };

  const handleSelectSector = (sectorId: string) => {
    const sector = sectors.find((s) => s.id === sectorId);
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
          imageSource={eventData?.image ?? require("@/src/modules/home/assets/cro-concierto.jpg")}
          title={eventData?.title ?? "Evento"}
          date={eventData?.date ?? ""}
          location={eventData?.location?.name ?? ""}
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
            {sectors.map((sector) => (
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
        <Button
          onPress={handleConfirm}
          style={[
            styles.confirmButton,
            sectors.every((s) => s.soldOut) ? { opacity: 0.6 } : null,
          ]}
          textStyle={styles.confirmButtonText}
          disabled={sectors.length === 0 || sectors.every((s) => s.soldOut)}
        >
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
