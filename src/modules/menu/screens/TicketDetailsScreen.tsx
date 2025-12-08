import React from "react";
import { View, StyleSheet, Pressable, Image, ScrollView, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import TicketCard from "@/src/modules/menu/components/TicketCard";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, Colors } from "@/src/core/constants/theme";
import { MenuStackParamList } from "@/src/modules/menu/navigation/MenuNavigator";

type Nav = NativeStackNavigationProp<MenuStackParamList, "TicketDetails">;
type Route = RouteProp<MenuStackParamList, "TicketDetails">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TICKET_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;
const TICKET_HEIGHT = 565;
const CORNER_RADIUS = 24;
const SHADOW_COLOR = Colors.light.primary;

const TICKET_DATA: Record<
  string,
  {
    title: string;
    venue: string;
    date: string;
    time: string;
    ticketId: string;
    image: any;
  }
> = {
  "1": {
    title: "C.R.O en Concierto",
    venue: "Alice Park",
    date: "11 de Abril, 2025",
    time: "Viernes, 9:00 pm",
    ticketId: "#8954673009",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  "2": {
    title: "Fexco Negocios 2025",
    venue: "Radius Gallery - Santa Cruz, CA",
    date: "15 de Mayo, 2025",
    time: "Jueves, 10:00 am",
    ticketId: "#8954673010",
    image: require("@/src/modules/home/assets/fexco.jpg"),
  },
  "3": {
    title: "El Circo - Capitulo Final",
    venue: "Alice Park",
    date: "20 de Junio, 2025",
    time: "Sabado, 8:00 pm",
    ticketId: "#8954673011",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },
  "4": {
    title: "Reik en Concierto",
    venue: "Euphoria",
    date: "06 de Junio, 2025",
    time: "Viernes, 10:00 pm",
    ticketId: "#8954673012",
    image: require("@/src/modules/home/assets/reik.png"),
  },
  "5": {
    title: "B-RLIN en Concierto",
    venue: "Euphoria",
    date: "28 de Febrero, 2025",
    time: "Sabado, 10:00 pm",
    ticketId: "#8954673013",
    image: require("@/src/modules/home/assets/brlin.png"),
  },
  "6": {
    title: "Pink Friday",
    venue: "Noma",
    date: "14 de Febrero, 2025",
    time: "Viernes, 11:00 pm",
    ticketId: "#8954673014",
    image: require("@/src/modules/home/assets/pink-friday.png"),
  },
};

export default function TicketDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const { ticketId, ticketCount = 1 } = route.params;
  const ticket = TICKET_DATA[ticketId] || TICKET_DATA["1"];
  const count = Math.max(1, ticketCount ?? 1);
  const tickets = Array.from({ length: count }).map((_, idx) => ({
    ...ticket,
    // give each ticket instance a unique id so QR/ticket label can differ if needed
    ticketId: `${ticket.ticketId}-${idx + 1}`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText numberOfLines={1} style={[styles.headerTitle, { color: theme.text }]}>
          {ticket.title}
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
              {/* Horizontal scroll to allow swiping multiple tickets later (paging enabled) */}
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -Spacing.xl }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                {/** Render one page per ticket instance (swipeable) */}
                {tickets.map((t, i) => {
                  const cardWidth = TICKET_WIDTH - Spacing.md;
                  return (
                    <View
                      key={i}
                      style={{
                        width: SCREEN_WIDTH,
                        height: TICKET_HEIGHT,
                        marginRight: 0,
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
      </ScrollView>
    </View>
  );
}

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
  ticketContent: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    borderRadius: CORNER_RADIUS,
  },

  /* IMAGE */
  imageContainer: { width: "100%", height: 200, position: "relative" },
  eventImage: { width: "100%", height: "100%" },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },

  eventInfo: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  eventTitle: { fontSize: 22, fontWeight: "700", marginBottom: Spacing.xs },

  venueRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  venueText: { fontSize: 14 },

  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  dateTimeItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateTimeDivider: { width: 1, height: 20, marginHorizontal: Spacing.lg },
  dateTimeText: { fontSize: 13 },

  dashedLineContainer: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
    width: "100%",
  },
  dashedLine: {
    // ensure the SVG uses its explicit width prop and is centered
    alignSelf: 'center',
  },

  /* QR SECTION */
  qrSection: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 10,
  },
  qrLabel: { fontSize: 12, marginTop: Spacing.md },
  qrValue: { fontSize: 17, fontWeight: "700" },
});
