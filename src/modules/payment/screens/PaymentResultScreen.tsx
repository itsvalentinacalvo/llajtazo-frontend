import React, { useMemo } from "react";
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
import { Button } from "@/src/core/components/Button";
import { useProfile } from "@/src/core/context/ProfileContext";
import { navigationRef } from "@/src/core/navigation/navigationRef";
import { getEventDetailById } from "@/src/core/test/eventDetailData";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";
import { useTickets } from "@/src/core/context/TicketsContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TICKET_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const TICKET_HEIGHT = 565;

const DEFAULT_IMAGE = require("@/src/modules/home/assets/cro-concierto.jpg");
const DEFAULT_TICKET_ID_PREFIX = "#ticket";

export default function PaymentResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  /** ---------------------------
   *   1. LEER PARAMS SIEMPRE
   * ---------------------------- */
  const params = (route.params as any) ?? {};

  const ticketCount = Number(params.ticketCount) || 1;
  const eventId = params.eventId;
  const methodId = params.methodId;
  const selectedTicketId = params.selectedTicketId;

  const eventData = useMemo(
    () => (eventId ? getEventDetailById(eventId) : undefined),
    [eventId]
  );

  /** ---------------------------
   *   2. PRIORIDAD A LO QUE LLEGA POR PARAMS
   * ---------------------------- */
  const eventTitle = params.eventTitle ?? eventData?.title ?? "";

  const eventVenue = params.eventVenue ?? eventData?.location?.name ?? "";

  const eventDate = params.eventDate ?? eventData?.date ?? "";

  const eventTime = params.eventTime ?? eventData?.time ?? "";

  const eventImage = params.eventImage ?? (eventData?.image as any) ?? DEFAULT_IMAGE;

  /** ---------------------------
   *   3. CREA LOS TICKETS
   * ---------------------------- */
  // Prefer legacy event-specific prefix if available in TEST_DATABASE (slug or first ticket id)
  const findLegacyPrefix = (eventIdParam?: string, titleParam?: string) => {
    try {
      // try direct match by slug or numeric id
      const bySlug = TEST_DATABASE.events.find((e: any) => String((e?.slug ?? "")).toLowerCase() === String(eventIdParam ?? "").toLowerCase());
      if (bySlug) return String((bySlug as any).slug ?? String((bySlug as any).id ?? "")).toLowerCase();

      const byId = TEST_DATABASE.events.find((e: any) => String((e?.id ?? "")) === String(eventIdParam ?? ""));
      if (byId) return String(((byId as any).slug ?? (byId as any).id ?? ""));

      // fallback: match by title normalization
      const norm = (s: string) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const byTitle = TEST_DATABASE.events.find((e: any) => norm(String((e as any).titulo ?? "")) === norm(titleParam || ""));
      if (byTitle) return String(((byTitle as any).slug ?? (byTitle as any).id ?? ""));

      // if still not found, take first ticket id as prefix if present
      const maybe = TEST_DATABASE.events.find((e: any) => String(((e?.slug ?? "")).toLowerCase()) === String(eventIdParam ?? "").toLowerCase() || String((e?.id ?? "")) === String(eventIdParam ?? ""));
      if (maybe && Array.isArray((maybe as any).tickets) && (maybe as any).tickets.length > 0) {
        const tid = String(((maybe as any).tickets?.[0]?.id ?? "")).split(/[^A-Za-z0-9]+/).join("");
        return tid || String(((maybe as any).slug ?? (maybe as any).id ?? ""));
      }
    } catch (e) {
      // ignore and fallback
    }
    return null;
  };

  const sectorParam = String(params.sector ?? "");
  const legacyPrefix = findLegacyPrefix(eventId, eventTitle) || undefined;
  const makeTitlePrefix = (title: string) => {
    if (legacyPrefix) return String(legacyPrefix).replace(/[^A-Za-z0-9]/g, "").toLowerCase();
    if (!title) return DEFAULT_TICKET_ID_PREFIX.replace(/[^A-Za-z0-9]/g, "");
    // take up to first 3 words, remove non-alphanum and lowercase
    const words = String(title).split(/\s+/).slice(0, 3).join("");
    return words.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  };

  const titlePrefix = makeTitlePrefix(eventTitle || "ticket");
  const sectorSlug = sectorParam ? String(sectorParam).replace(/\s+/g, "").toUpperCase() : "GENERAL";

  const tickets = Array.from({ length: ticketCount }).map((_, idx) => ({
    title: eventTitle,
    venue: eventVenue,
    date: eventDate,
    time: eventTime,
    image: eventImage,
    sector: sectorParam,
    ticketId: `${titlePrefix}-${sectorSlug}-${idx + 1}`,
  }));

  const { addPurchase } = useTickets();

  // Persist the purchase as a group so it appears in MyTickets
  React.useEffect(() => {
    try {
      const params = (route?.params as any) || {};
      const persistEventId = eventId ?? params?.eventId ?? "cro";

      // Build group using any provided title/image or fall back to the event data / params
      const groupTitle = params?.title ?? eventTitle ?? "Ticket";
      const groupImage = params?.image ?? eventImage ?? DEFAULT_IMAGE;
      const groupVenue = params?.venue ?? eventVenue ?? "";

      // Sanitize tickets: ensure ticketId exists and are strings
      const sanitizedTickets = tickets
        .filter((t) => t && t.ticketId)
        .map((t) => ({
          ticketId: String(t.ticketId),
          title: t.title ?? groupTitle,
          venue: t.venue ?? groupVenue,
          date: t.date ?? "",
          time: t.time ?? "",
          sector: (t as any).sector ?? "",
          image: t.image ?? groupImage,
        }));

      if (sanitizedTickets.length === 0) {
        // nothing to persist
        // eslint-disable-next-line no-console
        console.warn("[PaymentResult] no valid tickets to persist, skipping addPurchase");
        return;
      }

      const group = {
        eventId: persistEventId,
        title: groupTitle,
        venue: groupVenue,
        image: groupImage,
        tickets: sanitizedTickets,
      };

      // Log the group shape for debugging to ensure tickets are well formed
      try {
        // eslint-disable-next-line no-console
        console.log("[PaymentResult] persisting purchase group:", JSON.parse(JSON.stringify(group)));
      } catch (e) {
        // ignore stringify errors
      }

      if (typeof addPurchase === "function") {
        addPurchase(group as any);
      } else {
        // eslint-disable-next-line no-console
        console.warn("[PaymentResult] addPurchase not available");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[PaymentResult] error while persisting purchase:", err);
    }
    // intentionally run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { profile } = useProfile();

  /** ---------------------------
   *   4. PRECIOS desde params
   * ---------------------------- */
  const subtotal = Number(params.subtotal) || 0;
  const serviceFee = Number(params.serviceFee) || 0;
  const total = Number(params.total) || subtotal + serviceFee;

  /** ---------------------------
   *   5. BOTÓN BACK
   * ---------------------------- */
  const handleBackToHome = () => {
    const parent = navigation.getParent();
    if (parent && typeof parent.reset === "function") {
      parent.reset({ index: 0, routes: [{ name: "Home" as never }] });
      return;
    }

    try {
      if (navigationRef && typeof navigationRef.isReady === "function" && navigationRef.isReady()) {
        navigationRef.reset({ index: 0, routes: [{ name: "Home" }] });
        return;
      }
    } catch (e) {
      // ignore and fallback to navigation
    }

    (navigation as any).navigate?.("Home");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable onPress={handleBackToHome} style={styles.headerButton}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText numberOfLines={1} style={[styles.headerTitle, { color: theme.text }]}>
          {eventTitle}
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
          <ThemedText style={styles.value}>{eventVenue || ""}</ThemedText>

          <View style={styles.rowBetween}>
            <View>
              <ThemedText style={[styles.label, { marginTop: 20 }]}>Número de Tickets</ThemedText>
              <ThemedText style={styles.value}>x{ticketCount}</ThemedText>
            </View>

            <View>
              <ThemedText style={[styles.label, { marginTop: 20 }]}>Fecha</ThemedText>
              <ThemedText style={styles.value}>{eventDate}</ThemedText>
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
                {methodId === "card" ? (
                  <>
                    <MaterialCommunityIcons
                      name="credit-card-outline"
                      size={24}
                      color="black"
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText style={[styles.methodName, { color: "#000" }]}>Tarjeta</ThemedText>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={24}
                      color="black"
                      style={{ marginRight: Spacing.sm }}
                    />
                    <ThemedText style={[styles.methodName, { color: "#000" }]}>QR Simple</ThemedText>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button onPress={() => {
            // navigate to the Tickets screen inside Home navigator
            try {
              (navigation as any).navigate?.('Home', { screen: 'Tickets' });
            } catch (e) {
              (navigation as any).navigate?.('Tickets');
            }
          }} style={styles.primaryButton} textStyle={styles.primaryButtonText}>
            VER MIS TICKETS
          </Button>

          <Button onPress={() => {
            // navigate to checkout for the same event
              (navigation as any).navigate?.('PaymentCheckout', { eventId });
          }} style={styles.primaryButton} textStyle={styles.primaryButtonText}>
            COMPRAR MAS ENTRADAS
          </Button>
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

  ticketWrapper: {
    position: "relative",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    minHeight: TICKET_HEIGHT + Spacing.xl,
  },

  infoCard: {
    backgroundColor: Colors.light.white,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.md,
  },

  label: { ...Typography.body, color: Colors.light.textSecondary },
  value: { ...Typography.h4, fontWeight: "600", marginTop: 4 },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

  section: { marginBottom: Spacing.md },

  methodBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  methodCardInner: {
    backgroundColor: Colors.light.white,
    paddingVertical: Spacing.md,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  methodLabel: { fontSize: 16, color: Colors.light.textSecondary },
  methodRight: { flexDirection: "row", alignItems: "center" },
  methodName: { fontSize: 18, fontWeight: "700" },
  actionsContainer: { marginTop: Spacing.lg },
  primaryButton: {
    marginTop: Spacing.md,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
  },
  primaryButtonText: { color: Colors.light.white, fontWeight: "700" },
});
