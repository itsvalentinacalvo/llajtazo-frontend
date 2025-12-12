import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { EventCardSmall } from "@/src/core/components/EventCardSmall";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import { findEventById } from "@/src/core/data/events";

interface SponsoredEventCardProps {
  eventId: string;
  cardWidth: number;
  sponsor?: {
    name: string;
    avatar?: ImageSourcePropType;
  };
  onPress?: () => void;
}

export function SponsoredEventCard({ eventId, cardWidth, sponsor, onPress }: SponsoredEventCardProps) {
  const event = findEventById(eventId);
  if (!event) return null;
  const { title, subtitle, date, location, image } = event as any;
  const { theme } = useTheme();
  console.debug("[Home][SponsoredEventCard] render", { title });
  const avatarSource = sponsor && sponsor.avatar ? sponsor.avatar : undefined;

  return (
    <View style={[styles.cardWrapper, { width: cardWidth }]}>
      <View style={styles.sponsorHeader}>
        {avatarSource ? (
          <Image source={avatarSource} style={styles.sponsorAvatar} />
        ) : (
          <View style={[styles.sponsorAvatar, { backgroundColor: theme.border }]} />
        )}
        <View style={styles.sponsorInfo}>
          <View style={styles.sponsorNameRow}>
            <ThemedText style={styles.sponsorName}>{sponsor?.name ?? "Promotor"}</ThemedText>
            <Feather name="more-horizontal" size={16} color={theme.textSecondary} />
          </View>
          <ThemedText style={[styles.promotedLabel, { color: theme.textSecondary }]}>Promocionado</ThemedText>
        </View>
      </View>

      <EventCardSmall
        eventId={eventId}
        cardWidth={cardWidth}
        noMargin
        showBookmark={false}
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
