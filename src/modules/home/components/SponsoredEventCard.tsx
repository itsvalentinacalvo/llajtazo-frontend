import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { EventCardSmall } from "@/src/core/components/EventCardSmall";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface SponsoredEventCardProps {
  title: string;
  subtitle?: string;
  date: { day: string; month: string };
  location: string;
  image: ImageSourcePropType;
  cardWidth: number;
  sponsor: {
    name: string;
    avatar: ImageSourcePropType;
  };
  onPress?: () => void;
}

export function SponsoredEventCard({
  title,
  subtitle,
  date,
  location,
  image,
  cardWidth,
  sponsor,
  onPress,
}: SponsoredEventCardProps) {
  const { theme } = useTheme();
  console.debug("[Home][SponsoredEventCard] render", { title });

  return (
    <View style={[styles.cardWrapper, { width: cardWidth }]}>
      <View style={styles.sponsorHeader}>
        <Image source={sponsor.avatar} style={styles.sponsorAvatar} />
        <View style={styles.sponsorInfo}>
          <View style={styles.sponsorNameRow}>
            <ThemedText style={styles.sponsorName}>{sponsor.name}</ThemedText>
            <Feather name="more-horizontal" size={16} color={theme.textSecondary} />
          </View>
          <ThemedText style={[styles.promotedLabel, { color: theme.textSecondary }]}>
            Promocionado
          </ThemedText>
        </View>
      </View>

      <EventCardSmall
        title={title}
        subtitle={subtitle}
        date={date}
        location={location}
        image={image}
        cardWidth={cardWidth}
        noMargin
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {},
  sponsorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sponsorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sponsorName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  promotedLabel: {
    fontSize: 10,
    marginTop: 1,
  },
});
