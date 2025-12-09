import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  ImageSourcePropType,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing, Shadows } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface BusinessEventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  image: ImageSourcePropType;
  totalSales: number;
  ticketsSold: number;
  onPress?: () => void;
}

export function BusinessEventCard({
  title,
  date,
  time,
  location,
  image,
  totalSales,
  ticketsSold,
  onPress,
}: BusinessEventCardProps) {
  const { theme } = useTheme();

  const parseDateParts = (dateStr: string) => {
    const parts = dateStr.split(" DE ");
    return {
      day: parts[0] || "",
      month: parts[1] || "",
    };
  };

  const dateParts = parseDateParts(date);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.backgroundRoot },
        Shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardBody}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.eventImage} resizeMode="cover" />
          <View style={styles.dateBadge}>
            <ThemedText style={styles.dateDay}>{dateParts.day}</ThemedText>
            <ThemedText style={styles.dateMonth}>{dateParts.month}</ThemedText>
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.backgroundRoot }] }>
          <ThemedText
            style={[styles.schedule, { color: theme.primary }]}
            numberOfLines={1}
          >
            {`${date} - ${time}`.toUpperCase()}
          </ThemedText>

          <View style={styles.titleContainer}>
            <ThemedText
              style={[styles.title, { color: theme.text }]}
              numberOfLines={1}
            >
              {title}
            </ThemedText>
          </View>

          <View style={styles.locationRow}>
            <FontAwesome6
              name="location-dot"
              size={10}
              color={theme.textSecondary}
              style={styles.locationIcon}
            />
            <ThemedText style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
              {location}
            </ThemedText>
          </View>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Total Ventas
              </ThemedText>
              <ThemedText style={[styles.metricValue, { color: theme.text }] }>
                Bs. {totalSales.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </ThemedText>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <ThemedText style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Tickets Vendidos
              </ThemedText>
              <ThemedText style={[styles.metricValue, { color: theme.text }]}>
                {ticketsSold.toLocaleString("es-BO")}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  cardBody: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  dateBadge: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    minWidth: 10,
    alignItems: "center",
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5757",
    textAlign: "center",
    lineHeight: 16,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FF5757",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  content: {
    padding: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  schedule: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    flex: 1,
    fontSize: 12,
  },
  metricsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricDivider: {
    width: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginHorizontal: Spacing.sm,
  },
  metricLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
});
