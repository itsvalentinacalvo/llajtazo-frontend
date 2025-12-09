import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp, CommonActions } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing, Colors, Shadows } from "@/src/core/constants/theme";
import ExpandableText from "@/src/modules/home/components/ExpandableText";
import { SpotifyEmbed } from "@/src/modules/events/components/SpotifyEmbed";
import { TicketSelector } from "@/src/modules/events/components/TicketSelector";
import { getDraftEventById, updateDraftEventStatus } from "@/src/core/test/testDatabase";
import { interests } from "@/src/modules/auth/screens/InterestsScreen";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BusinessEvent } from "@/src/modules/business/test/businessData";

type PreviewEventRouteProp = RouteProp<{ PreviewEvent: { draftId?: string; eventId?: string } }, "PreviewEvent">;

export default function PreviewEventScreen() {
  const navigation = useNavigation();
  const route = useRoute<PreviewEventRouteProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { organizer, addEvent, events } = useBusiness();
  
  const draftId = route.params?.draftId || "";
  const eventId = route.params?.eventId || "";
  const draftEvent = getDraftEventById(draftId);
  const businessEvent = events.find((e) => e.id === eventId);
  const isPublishedEvent = Boolean(businessEvent && !draftEvent);
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    draftEvent?.tickets.find((t) => t.stock > 0)?.id || null
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDayOfWeek = (date: Date) => {
    return date.toLocaleDateString("es-ES", { weekday: "long" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTagLabels = (tagIds: string[]) => {
    return tagIds
      .map((id) => interests.find((i) => i.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const formatDateForCard = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const month = months[date.getMonth()];
    return `${day} DE ${month}`;
  };

  const formatTimeForCard = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();
  };

  const handlePublish = () => {
    if (!draftEvent) return;
    
    Alert.alert(
      "Publicar evento",
      "¿Estás seguro de que deseas publicar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Publicar",
          onPress: () => {
            setIsPublishing(true);
            updateDraftEventStatus(draftId, "published");
            
            const eventDate = new Date(draftEvent.dateTime);
            const newBusinessEvent: BusinessEvent = {
              id: `evt_${Date.now()}`,
              title: draftEvent.title,
              subtitle: draftEvent.subtitle || "",
              date: formatDateForCard(eventDate),
              time: formatTimeForCard(eventDate),
              image: draftEvent.eventImage?.uri 
                ? { uri: draftEvent.eventImage.uri } 
                : require("@/src/core/assets/events/alice-park/event1.png"),
              location: draftEvent.locationName,
              totalSales: 0,
              ticketsSold: 0,
              status: "active",
              tags: draftEvent.tags,
            };
            
            addEvent(newBusinessEvent);
            
            Alert.alert("Evento publicado", "Tu evento ha sido publicado exitosamente.", [
              {
                text: "OK",
                onPress: () => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: "BusinessTabs",
                          state: {
                            routes: [{ name: "InicioTab" }],
                          },
                        },
                      ],
                    })
                  );
                },
              },
            ]);
            setIsPublishing(false);
          },
        },
      ]
    );
  };

  if (!draftEvent && !businessEvent) {
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

  const eventDate = draftEvent ? new Date(draftEvent.dateTime) : new Date();
  const ticketsForSelector = draftEvent ? draftEvent.tickets.map((ticket) => ({
    id: ticket.id,
    name: ticket.name,
    price: ticket.price,
    currency: "Bs.",
    available: ticket.stock > 0,
    isSoldOut: ticket.stock === 0,
  })) : [];
  
  const displayTitle = isPublishedEvent ? businessEvent?.title : draftEvent?.title;
  const displaySubtitle = isPublishedEvent ? businessEvent?.subtitle : draftEvent?.subtitle;
  const displayImage = isPublishedEvent ? businessEvent?.image : draftEvent?.eventImage;
  const displayLocation = isPublishedEvent ? businessEvent?.location : draftEvent?.locationName;
  const displayTags = isPublishedEvent ? (businessEvent?.tags || []) : (draftEvent?.tags || []);
  const attendeesCount = isPublishedEvent ? (businessEvent?.ticketsSold || 0) : 0;
  
  const displayDateLabel = isPublishedEvent 
    ? businessEvent?.date || "" 
    : formatDate(eventDate);
  const displayTimeLabel = isPublishedEvent 
    ? businessEvent?.time || "" 
    : `${formatDayOfWeek(eventDate)}, ${formatTime(eventDate)}`;
  
  const handleEditEvent = () => {
    (navigation as any).navigate("EditEvento", { eventId });
  };

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
          {isPublishedEvent ? displayTitle : "Previsualización"}
        </ThemedText>
        <View style={styles.headerActions}>
          {isPublishedEvent ? (
            <Pressable
              onPress={handleEditEvent}
              style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
            >
              <Feather name="edit-2" size={20} color={theme.text} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.lg + insets.bottom + 80 }]}
      >
        <View style={styles.heroSection}>
          {displayImage ? (
            <Image
              source={typeof displayImage === "object" && "uri" in displayImage ? { uri: displayImage.uri } : displayImage}
              style={styles.coverImage}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.coverImage, styles.placeholderImage, { backgroundColor: theme.backgroundSecondary }]}>
              <Feather name="image" size={48} color={theme.textSecondary} />
            </View>
          )}
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
              +{attendeesCount} Irán
            </ThemedText>
          </View>
        </View>

        <View style={styles.mainContent}>
          <ThemedText type="h1" style={styles.eventTitle}>
            {displayTitle}
          </ThemedText>
          {displaySubtitle ? (
            <ThemedText style={[styles.eventSubtitle, { color: theme.textSecondary }]}>
              {displaySubtitle}
            </ThemedText>
          ) : null}

          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: "rgba(43, 187, 255, 0.12)" }]}>
              <Ionicons name="calendar" size={18} color={theme.primary} />
            </View>
            <View>
              <ThemedText style={styles.infoLabel}>{displayDateLabel}</ThemedText>
              <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>
                {displayTimeLabel}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: "rgba(43, 187, 255, 0.12)" }]}>
              <FontAwesome6 name="location-dot" size={18} color={theme.primary} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>{displayLocation}</ThemedText>
              {draftEvent?.googleMapsLink ? (
                <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>
                  Ver en Google Maps
                </ThemedText>
              ) : null}
            </View>
          </View>

          <View style={styles.organizerRow}>
            <Image
              source={organizer?.logo}
              style={styles.organizerAvatar}
              contentFit="cover"
            />
            <View style={styles.organizerInfo}>
              <ThemedText style={styles.organizerName}>{organizer?.name || "Organizador"}</ThemedText>
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

          {draftEvent?.spotifyPlaylist ? (
            <View style={[styles.section, styles.sectionCompact]}>
              <ThemedText type="h4" style={styles.sectionTitle}>Escuchalo</ThemedText>
              <SpotifyEmbed embedUrl={draftEvent.spotifyPlaylist} />
            </View>
          ) : null}

          {draftEvent?.details ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Detalles</ThemedText>
              <ExpandableText
                text={draftEvent.details.replace(/<[^>]*>/g, "")}
                maxChars={300}
                visibleChars={180}
              />
            </View>
          ) : null}

          {displayTags.length > 0 ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Etiquetas</ThemedText>
              <View style={styles.tagsRow}>
                {displayTags.map((tagId) => {
                  const tag = interests.find((i) => i.id === tagId);
                  return tag ? (
                    <View
                      key={tagId}
                      style={[styles.tagPill, { backgroundColor: Colors.light.primary }]}
                    >
                      <ThemedText style={styles.tagText}>{tag.label}</ThemedText>
                    </View>
                  ) : null;
                })}
              </View>
            </View>
          ) : null}

          {draftEvent?.mapImage ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Mapa de sectores</ThemedText>
              <Image
                source={{ uri: draftEvent.mapImage }}
                style={styles.sectorMap}
                contentFit="contain"
              />
            </View>
          ) : null}

          {ticketsForSelector.length > 0 ? (
            <View style={[styles.section, styles.sectionTickets]}>
              <ThemedText type="h4" style={styles.sectionTitle}>Tickets Disponibles</ThemedText>
              <TicketSelector
                tickets={ticketsForSelector}
                selectedTicketId={selectedTicketId}
                onSelectTicket={setSelectedTicketId}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      {!isPublishedEvent ? (
        <View style={[styles.publishButtonContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <Pressable
            style={[styles.publishButton, { backgroundColor: Colors.light.primary }]}
            onPress={handlePublish}
            disabled={isPublishing}
          >
            <ThemedText style={styles.publishButtonText}>
              {isPublishing ? "PUBLICANDO..." : "PUBLICAR"}
            </ThemedText>
          </Pressable>
        </View>
      ) : null}
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
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
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
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: Spacing.xs,
  },
  eventSubtitle: {
    fontSize: 16,
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTickets: {
    marginBottom: 0,
  },
  sectionCompact: {
    marginBottom: Spacing.xs - 80,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tagPill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  sectorMap: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.md,
  },
  pressed: {
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  publishButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: "transparent",
  },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
