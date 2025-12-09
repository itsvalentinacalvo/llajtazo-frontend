import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons, Feather } from "@expo/vector-icons";
import { ScreenScrollView } from "@/src/core/components/ScreenScrollView";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { BorderRadius, Spacing, Colors } from "@/src/core/constants/theme";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BusinessEvent } from "@/src/modules/business/test/businessData";
import { BusinessStackParamList } from "@/src/modules/business/navigation/BusinessNavigator";

type NavigationProp = NativeStackNavigationProp<BusinessStackParamList>;

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

interface EventMetricCardProps {
  event: BusinessEvent;
  onPress: () => void;
}

function EventMetricCard({ event, onPress }: EventMetricCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={[styles.eventCard, { backgroundColor: theme.backgroundDefault }]}
      onPress={onPress}
    >
      <Image source={event.image} style={styles.eventImage} contentFit="cover" />
      <View style={styles.eventInfo}>
        <ThemedText style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </ThemedText>
        <ThemedText style={[styles.eventDate, { color: theme.textSecondary }]}>
          {event.date} - {event.time}
        </ThemedText>
        <View style={styles.eventMetrics}>
          <View style={styles.metricItem}>
            <Ionicons name="cash-outline" size={14} color={theme.primary} />
            <ThemedText style={[styles.metricValue, { color: theme.primary }]}>
              Bs. {formatCurrency(event.totalSales)}
            </ThemedText>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="ticket-outline" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.metricValue, { color: theme.textSecondary }]}>
              {formatNumber(event.ticketsSold)}
            </ThemedText>
          </View>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

export default function MetricasTabScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { events } = useBusiness();
  const { headerHeight } = useHomeHeader();

  const activeEvents = useMemo(() => {
    return events.filter((event) => event.status === "active");
  }, [events]);

  const totals = useMemo(() => {
    const totalSales = events.reduce((sum, event) => sum + event.totalSales, 0);
    const totalTickets = events.reduce((sum, event) => sum + event.ticketsSold, 0);
    const activeCount = activeEvents.length;
    return { totalSales, totalTickets, activeCount };
  }, [events, activeEvents]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate("MetricasDetail", { eventId });
  };

  const renderEventCard = ({ item }: { item: BusinessEvent }) => (
    <EventMetricCard event={item} onPress={() => handleEventPress(item.id)} />
  );

  return (
    <ScreenScrollView
      contentHorizontalPadding={0}
      contentContainerStyle={[
        styles.container,
        { paddingTop: headerHeight + Spacing.sm },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Resumen General</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Vista general de todos tus eventos
          </ThemedText>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(43, 187, 255, 0.15)" }]}>
              <Ionicons name="cash-outline" size={24} color={Colors.light.primary} />
            </View>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Ventas Totales
            </ThemedText>
            <ThemedText style={styles.statValue}>
              Bs. {formatCurrency(totals.totalSales)}
            </ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.statIcon, { backgroundColor: "rgba(43, 187, 255, 0.15)" }]}>
              <Ionicons name="ticket-outline" size={24} color={Colors.light.primary} />
            </View>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Tickets Vendidos
            </ThemedText>
            <ThemedText style={styles.statValue}>
              {formatNumber(totals.totalTickets)}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.statCardWide, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.statIcon, { backgroundColor: "rgba(43, 187, 255, 0.15)" }]}>
            <Ionicons name="calendar-outline" size={24} color={Colors.light.primary} />
          </View>
          <View style={styles.wideCardContent}>
            <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
              Eventos Activos
            </ThemedText>
            <ThemedText style={styles.statValue}>{totals.activeCount}</ThemedText>
          </View>
        </View>

        <View style={styles.eventsSection}>
          <ThemedText style={styles.sectionTitle}>Metricas por Evento</ThemedText>
          <ThemedText style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Toca un evento para ver detalles
          </ThemedText>
        </View>

        <FlatList
          data={activeEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.eventsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bar-chart-outline" size={48} color={theme.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No tienes eventos con metricas
              </ThemedText>
            </View>
          }
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  statCardWide: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  wideCardContent: {
    marginLeft: Spacing.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  eventsSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 13,
  },
  eventsList: {
    paddingBottom: Spacing.xl,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
  },
  eventInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  eventMetrics: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
