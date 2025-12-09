import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import TicketCard from "@/src/modules/menu/components/TicketCard";
import { PriceSummary } from "@/src/modules/payment/components/PriceSummary";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, BorderRadius, Typography } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useProfile } from "@/src/core/context/ProfileContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TICKET_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const TICKET_HEIGHT = 565;

const SAMPLE_TICKET = {
  title: "C.R.O en Concierto",
  venue: "Alice Park",
  date: "11 de Abril, 2025",
  time: "Viernes, 9:00 pm",
  ticketId: "#8954673009",
  image: require("@/src/modules/home/assets/cro-concierto.jpg"),
};

export default function PaymentResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  // ticketCount is expected to be passed from PaymentCheckout via navigation params
  const rawTicketCount = ((route?.params) as any)?.ticketCount ?? 1;
  const ticketCount = Number(rawTicketCount) || 1;
  const tickets = Array.from({ length: ticketCount }).map((_, idx) => ({
    ...SAMPLE_TICKET,
    ticketId: `${SAMPLE_TICKET.ticketId}-${idx + 1}`,
  }));

  const { profile } = useProfile();

  // Read price values from navigation params (passed by PaymentCheckout)
  const rawSubtotal = ((route?.params) as any)?.subtotal;
  const rawServiceFee = ((route?.params) as any)?.serviceFee;
  const rawTotal = ((route?.params) as any)?.total;

  const subtotal = Number(rawSubtotal) || 0;
  const serviceFee = Number(rawServiceFee) || 0;
  const total = Number(rawTotal) || subtotal + serviceFee;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}> 
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}> 
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}> 
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText numberOfLines={1} style={[styles.headerTitle, { color: theme.text }]}> 
          {SAMPLE_TICKET.title}
        </ThemedText>

        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.xl,
          paddingTop: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ticketWrapper}>
          <View style={{ width: "100%", height: TICKET_HEIGHT + Spacing.xl }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -Spacing.xl }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {tickets.map((t, i) => {
                const cardWidth = TICKET_WIDTH - Spacing.md;
                return (
                  <View
                    key={i}
                    style={{
                      width: SCREEN_WIDTH,
                      height: TICKET_HEIGHT,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TicketCard ticket={t} width={cardWidth} height={TICKET_HEIGHT} />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={styles.label}>Nombre</ThemedText>
          <ThemedText style={styles.value}>{profile?.name ?? "Usuario"}</ThemedText>

          <ThemedText style={[styles.label, { marginTop: 20 }]}>Ubicación</ThemedText>
          <ThemedText style={styles.value}>Cochabamba, Cercado</ThemedText>

          <View style={styles.rowBetween}>
            <View>
              <ThemedText style={[styles.label, { marginTop: 20 }]}>Número de Tickets</ThemedText>
              <ThemedText style={styles.value}>x{ticketCount}</ThemedText>
            </View>

            <View>
              <ThemedText style={[styles.label, { marginTop: 20 }]}>Fecha</ThemedText>
              <ThemedText style={styles.value}>{SAMPLE_TICKET.date}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <PriceSummary subtotal={subtotal} serviceFee={serviceFee} total={total} />
        </View>

        <View style={styles.section}>
          <View style={styles.methodBorder}>
            <View style={styles.methodCardInner}>
              <ThemedText style={styles.methodLabel}>Método de pago</ThemedText>

              <View style={styles.methodRight}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" style={{ marginRight: Spacing.sm }} />
                <ThemedText style={[styles.methodName, { color: '#000' }]}>QR Simple</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const CORNER_RADIUS = 24;
const SHADOW_COLOR = Colors.light.primary;

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },

  /* TICKET LAYOUT */
  scrollContent: {},
  ticketWrapper: {
    position: "relative",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    minHeight: TICKET_HEIGHT + Spacing.xl,
  },
  shadowContainer: { position: "absolute", top: 12, left: 6 },
  shadowSvgContainer: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  ticketContainer: { position: "relative", overflow: "hidden" },
  ticketContent: { position: "absolute", top: 0, left: 0, overflow: "hidden", borderRadius: CORNER_RADIUS },

  /* IMAGE */
  imageContainer: { width: "100%", height: 200, position: "relative" },
  eventImage: { width: "100%", height: "100%" },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },

  eventInfo: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  eventTitle: { fontSize: 22, fontWeight: "700", marginBottom: Spacing.xs },

  venueRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  venueText: { fontSize: 14 },

  dateTimeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  dateTimeItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateTimeDivider: { width: 1, height: 20, marginHorizontal: Spacing.lg },
  dateTimeText: { fontSize: 13 },

  dashedLineContainer: { alignItems: "center", paddingVertical: Spacing.sm, width: "100%" },
  dashedLine: { alignSelf: "center" },

  /* QR SECTION */
  qrSection: { alignItems: "center", paddingVertical: Spacing.lg, paddingBottom: Spacing.xl, gap: 10 },
  qrLabel: { fontSize: 12, marginTop: Spacing.md },
  qrValue: { fontSize: 17, fontWeight: "700" },

  /* INFO & METHOD */
  section: { marginBottom: Spacing.md },
  infoCard: {
    backgroundColor: Colors.light.white,
    paddingVertical: Spacing.xl,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderRadius: BorderRadius.md,
  },
  label: { ...Typography.body, color: Colors.light.textSecondary },
  value: { ...Typography.h4, fontWeight: "600", marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  
  /* New pill-style method card */
  methodBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.lg,
  },
  methodCardInner: {
    backgroundColor: Colors.light.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLabel: { fontSize: 16, color: Colors.light.textSecondary },
  methodRight: { flexDirection: "row", alignItems: "center" },
  methodName: { fontSize: 18, fontWeight: "700", color: Colors.light.primary },
});

