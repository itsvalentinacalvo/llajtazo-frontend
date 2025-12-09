import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing, Colors, Shadows } from "@/src/core/constants/theme";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BUSINESS_TICKETS, Ticket } from "@/src/modules/business/test/businessData";
import { BusinessStackParamList } from "@/src/modules/business/navigation/BusinessNavigator";

type MetricasRouteProp = RouteProp<BusinessStackParamList, "MetricasDetail">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const Y_AXIS_WIDTH = 35;
const CHART_PADDING = Spacing.xl * 2 + Spacing.lg * 2 + Y_AXIS_WIDTH;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING;
const CHART_HEIGHT = 120;

type TimePeriod = "annual" | "monthly" | "daily";

const MONTHLY_DATA = [
  { label: "Abril", value: 8000 },
  { label: "Mayo", value: 12000 },
  { label: "Junio", value: 18000 },
  { label: "Julio", value: 15000 },
  { label: "Ago", value: 25000 },
  { label: "Sept", value: 35000 },
  { label: "Oct", value: 55000 },
  { label: "Nov", value: 72000 },
  { label: "Dic", value: 95000 },
];

const ANNUAL_DATA = [
  { label: "2021", value: 120000 },
  { label: "2022", value: 180000 },
  { label: "2023", value: 250000 },
  { label: "2024", value: 326600 },
];

const DAILY_DATA = [
  { label: "Lun", value: 5200 },
  { label: "Mar", value: 8400 },
  { label: "Mie", value: 6800 },
  { label: "Jue", value: 9500 },
  { label: "Vie", value: 15200 },
  { label: "Sab", value: 18900 },
  { label: "Dom", value: 12300 },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toString();
}

function formatYLabel(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return value.toString();
}

function SalesChart({ data, period }: { data: { label: string; value: number }[]; period: TimePeriod }) {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value));
  const yLabels = [maxValue, maxValue * 0.5, maxValue * 0.2, maxValue * 0.1, 0];

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (d.value / maxValue) * CHART_HEIGHT;
    return { x, y };
  });

  const linePath = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 3;
    const cpX2 = prev.x + (2 * (point.x - prev.x)) / 3;
    return `${path} C ${cpX1} ${prev.y} ${cpX2} ${point.y} ${point.x} ${point.y}`;
  }, "");

  const areaPath = `${linePath} L ${CHART_WIDTH} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.yAxisLabels}>
        {yLabels.map((label, i) => (
          <ThemedText key={i} style={[styles.yLabel, { color: theme.textSecondary }]}>
            {formatYLabel(label)}
          </ThemedText>
        ))}
      </View>
      <View style={styles.chartArea}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Colors.light.primary} stopOpacity="0.3" />
              <Stop offset="1" stopColor={Colors.light.primary} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#areaGradient)" />
          <Path d={linePath} stroke={Colors.light.primary} strokeWidth={2} fill="none" />
        </Svg>
        <View style={styles.xAxisLabels}>
          {data.map((d, i) => (
            <ThemedText key={i} style={[styles.xLabel, { color: theme.textSecondary }]}>
              {d.label}
            </ThemedText>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function MetricasBusinessScreen() {
  const navigation = useNavigation();
  const route = useRoute<MetricasRouteProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { events } = useBusiness();

  const eventId = route.params?.eventId;
  const event = events.find((e) => e.id === eventId);

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("monthly");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const periodLabels: Record<TimePeriod, string> = {
    annual: "Por Año",
    monthly: "Por Mes",
    daily: "Por Día",
  };

  const chartData = useMemo(() => {
    switch (selectedPeriod) {
      case "annual":
        return ANNUAL_DATA;
      case "daily":
        return DAILY_DATA;
      default:
        return MONTHLY_DATA;
    }
  }, [selectedPeriod]);

  const eventTickets = useMemo(() => {
    if (!eventId) return BUSINESS_TICKETS.slice(0, 2);
    return BUSINESS_TICKETS.filter((t) => t.eventId === eventId);
  }, [eventId]);

  const ticketTableData = useMemo(() => {
    return eventTickets.map((ticket) => {
      const subtotalFee = ticket.soldCount * ticket.fee;
      const subtotal = ticket.soldCount * ticket.price;
      return {
        sector: ticket.name,
        price: ticket.price,
        quantity: ticket.soldCount,
        subtotalFee,
        subtotal,
      };
    });
  }, [eventTickets]);

  const totalSales = event?.totalSales || 326600;
  const ticketsSold = event?.ticketsSold || 26600;

  const handlePreviewPress = () => {
    if (eventId) {
      (navigation as any).navigate("PreviewEvent", { draftId: eventId });
    }
  };

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h4" style={styles.headerTitle}>Metricas</ThemedText>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <ThemedText type="h3">Evento no encontrado</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="h4" style={styles.headerTitle}>Metricas</ThemedText>
        <Pressable style={styles.headerRight}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.eventImageContainer}>
          <Image source={event.image} style={styles.eventImage} contentFit="cover" />
        </View>

        <View style={styles.eventInfo}>
          <ThemedText type="h2" style={styles.eventTitle}>{event.title}</ThemedText>
          <ThemedText style={[styles.eventDateTime, { color: theme.textSecondary }]}>
            {event.date} - {event.time}
          </ThemedText>
          <Pressable onPress={handlePreviewPress}>
            <ThemedText style={[styles.previewLink, { color: theme.primary }]}>
              Previsualizar el Evento <Feather name="external-link" size={14} color={theme.primary} />
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(43, 187, 255, 0.15)" }]}>
              <Ionicons name="cash-outline" size={20} color={theme.primary} />
            </View>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>BOB</ThemedText>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {formatCurrency(totalSales)}
            </ThemedText>
            <ThemedText style={[styles.statSubLabel, { color: theme.primary }]}>
              Ventas Totales
            </ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(43, 187, 255, 0.15)" }]}>
              <Ionicons name="ticket-outline" size={20} color={theme.primary} />
            </View>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}> </ThemedText>
            <ThemedText style={[styles.statValue, { color: theme.text }]}>
              {formatCurrency(ticketsSold)}
            </ThemedText>
            <ThemedText style={[styles.statSubLabel, { color: theme.primary }]}>
              Tickets Vendidos
            </ThemedText>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.chartHeader}>
            <ThemedText type="h4" style={styles.chartTitle}>Ventas</ThemedText>
            <Pressable
              style={[styles.periodSelector, { borderColor: theme.border }]}
              onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}
            >
              <ThemedText style={{ color: theme.text }}>{periodLabels[selectedPeriod]}</ThemedText>
              <Feather name="chevron-down" size={16} color={theme.text} />
            </Pressable>
          </View>
          {showPeriodDropdown ? (
            <View style={[styles.dropdown, { backgroundColor: theme.backgroundRoot, borderColor: theme.border }]}>
              {(["annual", "monthly", "daily"] as TimePeriod[]).map((period) => (
                <Pressable
                  key={period}
                  style={[
                    styles.dropdownItem,
                    selectedPeriod === period && { backgroundColor: theme.backgroundSecondary },
                  ]}
                  onPress={() => {
                    setSelectedPeriod(period);
                    setShowPeriodDropdown(false);
                  }}
                >
                  <ThemedText style={{ color: theme.text }}>{periodLabels[period]}</ThemedText>
                </Pressable>
              ))}
            </View>
          ) : null}
          <SalesChart data={chartData} period={selectedPeriod} />
        </View>

        <View style={styles.ticketsSection}>
          <ThemedText type="h4" style={[styles.ticketsTitle, { color: theme.primary }]}>
            Tickets
          </ThemedText>
          <View style={[styles.ticketsTable, { borderColor: theme.border }]}>
            <View style={[styles.tableHeader, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText style={[styles.tableHeaderCell, styles.sectorCell]}>Sector</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.priceCell]}>Precio</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.quantityCell]}>Cantidad</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.feeCell]}>Subtotal Fee</ThemedText>
              <ThemedText style={[styles.tableHeaderCell, styles.subtotalCell]}>Subtotal</ThemedText>
            </View>
            {ticketTableData.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && { backgroundColor: theme.backgroundDefault },
                ]}
              >
                <ThemedText style={[styles.tableCell, styles.sectorCell]}>{row.sector}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.priceCell]}>{row.price}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.quantityCell]}>{row.quantity}</ThemedText>
                <ThemedText style={[styles.tableCell, styles.feeCell]}>
                  Bs.{row.subtotalFee.toLocaleString("es-BO")}
                </ThemedText>
                <ThemedText style={[styles.tableCell, styles.subtotalCell]}>
                  Bs.{row.subtotal.toLocaleString("es-BO")}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  eventImageContainer: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventInfo: {
    marginBottom: Spacing.lg,
  },
  eventTitle: {
    marginBottom: Spacing.xs,
  },
  eventDateTime: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  previewLink: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  statSubLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: 18,
  },
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  dropdown: {
    position: "absolute",
    top: 56,
    right: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    zIndex: 10,
    ...Shadows.card,
  },
  dropdownItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  chartContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  yAxisLabels: {
    width: Y_AXIS_WIDTH,
    justifyContent: "space-between",
    paddingRight: Spacing.xs,
    marginRight: Spacing.xs,
  },
  yLabel: {
    fontSize: 11,
    textAlign: "right",
  },
  chartArea: {
    flex: 1,
    overflow: "hidden",
  },
  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
    paddingHorizontal: 2,
  },
  xLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  ticketsSection: {
    marginBottom: Spacing.xl,
  },
  ticketsTitle: {
    marginBottom: Spacing.md,
  },
  ticketsTable: {
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  tableCell: {
    fontSize: 11,
    textAlign: "center",
  },
  sectorCell: {
    flex: 1.2,
  },
  priceCell: {
    flex: 0.8,
  },
  quantityCell: {
    flex: 1,
  },
  feeCell: {
    flex: 1.3,
  },
  subtotalCell: {
    flex: 1.3,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
