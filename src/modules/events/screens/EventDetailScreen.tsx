import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing, Colors, Shadows } from "@/src/core/constants/theme";
import { RichTextRenderer } from "@/src/modules/events/components/RichTextRenderer";
import { SpotifyEmbed } from "../components/SpotifyEmbed";
import { SectorMap } from "../components/SectorMap";
import { TicketSelector } from "../components/TicketSelector";
import { MiniMap } from "../components/MiniMap";
import { ShareTab } from "@/src/core/components/ShareTab";
import { BuyTicketButton } from "../components/BuyTicketButton";
import { getEventDetailById } from "@/src/core/test/eventDetailData";
import { findEventById, findCanonicalEvent } from "@/src/core/test/events";

type EventDetailRouteProp = RouteProp<{ EventDetail: { eventId: string } }, "EventDetail">;

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<EventDetailRouteProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const eventId = route.params?.eventId || "1";
  let eventData = getEventDetailById(eventId);

  // If no test detail exists, try to resolve a canonical event and build a
  // minimal EventDetail object so the screen can render without crashing.
  if (!eventData) {
    const canonical = findEventById(eventId) || findCanonicalEvent({ id: eventId } as any);
    if (canonical) {
      const dateObj: any = canonical.date;
      const dateStr = dateObj
        ? (typeof dateObj === "string" ? dateObj : `${dateObj.day} de ${dateObj.month}`)
        : "";

      // safe default organizer/avatar — reuse the Alice Park asset if available
      let defaultAvatar: any;
      try {
        // path used elsewhere in test data
        defaultAvatar = require("@/src/core/assets/events/alice-park/profile.jpg");
      } catch (e) {
        defaultAvatar = undefined;
      }

      eventData = {
        id: canonical.id,
        title: canonical.title,
        subtitle: canonical.subtitle || "",
        description: canonical.subtitle || "",
        date: dateStr,
        time: canonical.time || "",
        dayOfWeek: "",
        image: canonical.image as any,
        attendeesCount: canonical.attendees || 0,
        ageRestriction: "",
        refundPolicy: "",
        organizer: {
          id: 0,
          name: canonical.sponsor?.name || canonical.location || "Organizador",
          avatar: (canonical.sponsor && (canonical.sponsor.avatar as any)) || defaultAvatar,
          followers: 0,
          isFollowing: false,
        },
        location: {
          id: 0,
          name: canonical.location || "",
          address: canonical.location || "",
          latitude: (canonical as any).coordinate?.latitude || 0,
          longitude: (canonical as any).coordinate?.longitude || 0,
        },
        tickets: [],
        sectors: [],
        spotifyPlaylist: { embedUrl: "" },
        category: (canonical.category && (Array.isArray(canonical.category) ? canonical.category[0] : canonical.category)) || "",
      } as any;
    }
  }

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    eventData?.tickets?.find((t) => t.available && !t.isSoldOut)?.id || null
  );
  const [isFollowing, setIsFollowing] = useState(eventData?.organizer?.isFollowing || false);
  const [isShareTabVisible, setShareTabVisible] = useState(false);

  if (!eventData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.backgroundRoot }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <ThemedText type="h3">Evento no encontrado</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.backgroundRoot }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="h4" style={styles.headerTitle} numberOfLines={1}>
          {eventData.title}
        </ThemedText>
        <View style={styles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              styles.headerActionButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setShareTabVisible(true)}
          >
            <Feather name="share" size={22} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
         contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.lg + insets.bottom }]}
      >
        <View style={styles.heroSection}>
          <Image
            source={eventData.image}
            style={styles.coverImage}
            contentFit="cover"
          />
          <View style={styles.attendeesBadge}>
            <View style={styles.avatarStack}>
              {[0, 1, 2].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.primary, borderColor: theme.white },
                    index > 0 && styles.avatarOverlap,
                  ]}
                />
              ))}
            </View>
            <ThemedText style={[styles.attendeesText, { color: theme.primary }]}>
              +{eventData.attendeesCount} Irán
            </ThemedText>
          </View>
        </View>

        <View style={styles.mainContent}>
          <ThemedText type="h1" style={styles.eventTitle}>
            {eventData.title}
          </ThemedText>

          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: "rgba(43, 187, 255, 0.12)" }]}>
              <Ionicons name="calendar" size={18} color={theme.primary} />
            </View>
            <View>
              <ThemedText style={styles.infoLabel}>{eventData.date}</ThemedText>
              <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>
                {eventData.dayOfWeek}, {eventData.time}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: "rgba(43, 187, 255, 0.12)" }]}>
              <FontAwesome6 name="location-dot" size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>{eventData.location.name}</ThemedText>
              <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>
                {eventData.location?.address ? eventData.location.address.split(",")[0] : eventData.location?.name}
              </ThemedText>
            </View>
          </View>

          <View style={styles.organizerRow}>
            <Image
              source={eventData.organizer.avatar}
              style={styles.organizerAvatar}
              contentFit="cover"
            />
            <View style={styles.organizerInfo}>
              <ThemedText style={styles.organizerName}>{eventData.organizer.name}</ThemedText>
              <ThemedText style={[styles.organizerRole, { color: theme.textSecondary }]}>
                Organizador
              </ThemedText>
            </View>
            <Pressable
              onPress={() => setIsFollowing(!isFollowing)}
              style={({ pressed }) => [
                styles.followButton,
                {
                  backgroundColor: isFollowing ? theme.backgroundSecondary : theme.primary,
                },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText
                style={[
                  styles.followButtonText,
                  { color: isFollowing ? theme.text : "#FFFFFF" },
                ]}
              >
                {isFollowing ? "Following" : "Follow"}
              </ThemedText>
            </Pressable>
          </View>

          {Array.isArray(eventData.tickets) && eventData.tickets.some((t) => t.available && !t.isSoldOut) && (
            <BuyTicketButton style={styles.buyButton} selectedTicketId={selectedTicketId} eventId={eventId} />
          )}

          {Boolean(eventData.spotifyPlaylist?.embedUrl) && (
            <View style={[styles.section, styles.sectionCompact]}>
              <ThemedText type="h4" style={styles.sectionTitle}>Escuchalo</ThemedText>
              <SpotifyEmbed embedUrl={eventData.spotifyPlaylist.embedUrl} />
            </View>
          )}

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>Detalles</ThemedText>
            <RichTextRenderer html={eventData.description} color={theme.text} />
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>Ubicación</ThemedText>
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Feather name="map-pin" size={16} color={theme.primary} />
                <View style={styles.locationInfo}>
                  <ThemedText style={styles.locationName}>{eventData.location.address}</ThemedText>
                  <ThemedText style={[styles.locationVenue, { color: theme.textSecondary }]}>
                    {eventData.location.name}
                  </ThemedText>
                </View>
              </View>
              <MiniMap
                latitude={eventData.location?.latitude ?? 0}
                longitude={eventData.location?.longitude ?? 0}
                locationName={eventData.location?.name ?? ""}
                address={eventData.location?.address ?? ""}
              />
            </View>
          </View>

          {Array.isArray(eventData.sectors) && eventData.sectors.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Mapa de sectores</ThemedText>
              <SectorMap sectors={eventData.sectors} />
            </View>
          )}

          {Array.isArray(eventData.tickets) && eventData.tickets.length > 0 && (
            <View style={[styles.section, styles.sectionTickets]}>
              <ThemedText type="h4" style={styles.sectionTitle}>Tickets Disponibles</ThemedText>
              <TicketSelector
                tickets={eventData.tickets}
                selectedTicketId={selectedTicketId}
                onSelectTicket={setSelectedTicketId}
              />
              <BuyTicketButton style={[styles.buyButton, styles.buyButtonSecondary]} selectedTicketId={selectedTicketId} eventId={eventId} />
            </View>
          )}
        </View>
      </ScrollView>

      <ShareTab
        visible={isShareTabVisible}
        onClose={() => setShareTabVisible(false)}
      />
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
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  heroSection: {
    position: "relative",
    marginBottom: Spacing.lg,
  },
  coverImage: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.md,
  },
  attendeesBadge: {
    position: "absolute",
    bottom: -16,
    left: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.fab,
  },
  avatarStack: {
    flexDirection: "row",
    marginRight: Spacing.xs,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  attendeesText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  mainContent: {
    paddingTop: Spacing.md,
  },
  eventTitle: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  infoSubLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  organizerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: "600",
  },
  organizerRole: {
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    width: "100%",
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  buyButtonSecondary: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTickets: {
    marginBottom: 0,
  },
  sectionCompact: {
    marginBottom: Spacing.xs -80,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  restrictionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,    
    gap: Spacing.xs,
  },
  restrictionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  refundRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  refundText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  locationCard: {
    padding: Spacing.md,
    backgroundColor: "#F9F9F9",
    borderRadius: BorderRadius.sm,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
  },
  locationVenue: {
    fontSize: 12,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
