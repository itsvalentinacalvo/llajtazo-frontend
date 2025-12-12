import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Linking,
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
import { RichTextRenderer } from "@/src/modules/events/components/RichTextRenderer";
import { SpotifyEmbed } from "@/src/modules/events/components/SpotifyEmbed";
import { TicketSelector } from "@/src/modules/events/components/TicketSelector";
import { getDraftEventById, updateDraftEventStatus } from "@/src/core/test/testDatabase";
import { interests } from "@/src/modules/auth/screens/InterestsScreen";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BusinessEvent } from "@/src/modules/business/test/businessData";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";
import type { EventDetail } from "@/src/core/test/eventDetailData";
import { getEventDetailById } from "@/src/core/test/eventDetailData";
import { MiniMap } from "@/src/modules/events/components/MiniMap";

type PreviewEventRouteProp = RouteProp<{ PreviewEvent: { draftId?: string; eventId?: string; eventDetail?: EventDetail } }, "PreviewEvent">;

export default function PreviewEventScreen() {
  const navigation = useNavigation();
  const route = useRoute<PreviewEventRouteProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { organizer, addEvent, events } = useBusiness();
  try {
    console.log("[PreviewEvent] Route params:", {
      draftId: route.params?.draftId,
      eventId: route.params?.eventId,
      hasDetail: Boolean(route.params?.eventDetail),
    });
  } catch {}
  
  const draftId = route.params?.draftId || "";
  const eventId = route.params?.eventId || "";
  const detail = route.params?.eventDetail;
  const draftEvent = getDraftEventById(draftId);
  let businessEvent = events.find((e) => e.id === eventId);
  // Resolve full EventDetail when only eventId is provided
  let eventDetailFromDb: EventDetail | undefined = undefined;
  if (!detail && eventId) {
    const raw = (TEST_DATABASE.events || []).find((e) => String(e.id) === eventId);
    const slug: string | undefined = (raw as any)?.slug;
    if (slug) {
      eventDetailFromDb = getEventDetailById(slug) || undefined;
    }
  }
  // Unified detail: prefer route detail, else resolved from DB
  const effectiveDetail: EventDetail | undefined = detail || eventDetailFromDb;
  // Fallback: if context isn't populated yet, build BusinessEvent from TEST_DATABASE
  if (!businessEvent && eventId) {
    const raw = (TEST_DATABASE.events || []).find((e) => String(e.id) === eventId);
    if (raw) {
      const place = (TEST_DATABASE.lugares || []).find((l) => l.id === raw.lugar_id);
      const dt = new Date(raw.start_time);
      const day = dt.getDate().toString();
      const monthsAbbr = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
      const month = monthsAbbr[dt.getMonth()];
      const date = `${day} ${month}`;
      const time = dt.toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
      // Tickets may be defined inside event detail data or a separate structure; guard for absence
      const ticketsForEvent: Array<any> = Array.isArray((TEST_DATABASE as any).tickets)
        ? ((TEST_DATABASE as any).tickets as Array<any>).filter((t: any) => t.evento_id === raw.id)
        : [];
      const ticketsSold = ticketsForEvent.reduce((acc: number, t: any) => acc + (t.soldCount || 0), 0);
      const totalSales = ticketsForEvent.reduce((acc: number, t: any) => acc + ((t.precio || 0) * (t.soldCount || 0)), 0);
      businessEvent = {
        id: String(raw.id),
        title: raw.titulo,
        subtitle: raw.subtitulo || "",
        date,
        time,
        image: raw.cover_url,
        location: place?.nombre || "",
        latitude: place?.latitud,
        longitude: place?.longitud,
        totalSales,
        ticketsSold,
        status: "active",
        tags: [],
        descriptionHTML: raw.descripcion,
        googleMapsLink: place ? `https://www.google.com/maps?q=${place.latitud},${place.longitud}` : undefined,
        startTimeIso: raw.start_time,
        tickets: ticketsForEvent.map((t: any) => ({
          id: String(t.id),
          name: t.nombre,
          price: t.precio,
          currency: "Bs.",
          available: (t.stock || 0) > 0,
          isSoldOut: (t.stock || 0) === 0,
        })),
      };
    }
  }
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
    // Formato badge: Numero (sin cero a la izquierda) + Mes abreviado (mayúsculas)
    const day = date.getDate().toString();
    const monthsAbbr = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const month = monthsAbbr[date.getMonth()];
    // Retornamos en una sola cadena para el modelo BusinessEvent; la UI de Inicio puede dividir si necesita
    return `${day} ${month}`;
  };

  const formatTimeForCard = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();
  };

  const handlePublish = () => {
    // Allow publishing from draftEvent or from eventDetail-based preview
    if (!draftEvent && !detail) return;
    
    Alert.alert(
      "Publicar evento",
      "¿Estás seguro de que deseas publicar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Publicar",
          onPress: () => {
            setIsPublishing(true);
            try {
              updateDraftEventStatus(draftId, "published");
            } catch (err) {
              console.error("[PreviewEvent] Error actualizando estado del borrador a 'published':", err, { draftId });
            }
            
            let newBusinessEvent: BusinessEvent;
            if (draftEvent) {
              const eventDate = new Date(draftEvent.dateTime);
              newBusinessEvent = {
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
                descriptionHTML: draftEvent.details || "",
                googleMapsLink: draftEvent.googleMapsLink || "",
                spotifyUrl: draftEvent.spotifyUrl || "",
                dayOfWeekLabel: formatDayOfWeek(eventDate),
                startTimeIso: eventDate.toISOString(),
                sectorImage: draftEvent.mapImage ? { uri: draftEvent.mapImage } : undefined,
                tickets: draftEvent.tickets.map((t) => ({
                  id: t.id,
                  name: t.name,
                  price: t.price,
                  currency: "Bs.",
                  available: t.stock > 0,
                  isSoldOut: t.stock === 0,
                })),
              };
            } else if (detail) {
              newBusinessEvent = {
                id: `evt_${Date.now()}`,
                title: detail.title,
                subtitle: detail.subtitle || "",
                date: detail.date,
                time: detail.time,
                image: detail.image,
                location: detail.location.name,
                totalSales: 0,
                ticketsSold: 0,
                status: "active",
                tags: detail.tags || [],
                descriptionHTML: detail.description || "",
                googleMapsLink: detail.googleMapsLink || "",
                spotifyUrl: detail.spotifyPlaylist?.embedUrl || "",
                dayOfWeekLabel: detail.dayOfWeek || "",
                tickets: (detail.tickets || []).map((t) => ({
                  id: t.id,
                  name: t.name,
                  price: t.price,
                  currency: t.currency || "Bs.",
                  available: t.available,
                  isSoldOut: t.isSoldOut,
                })),
              };
            } else {
              return;
            }
            if (draftEvent) {
              try {
                updateDraftEventStatus(draftId, "published");
              } catch (err) {
                console.error("[PreviewEvent] Error re-actualizando estado del borrador:", err, { draftId });
              }
            }
            
            try {
              console.log("[PreviewEvent] Publicando evento con payload:", newBusinessEvent);
              addEvent(newBusinessEvent);
            } catch (err) {
              console.error("[PreviewEvent] Error agregando evento a BusinessContext:", err, { newBusinessEvent });
            }
            
            Alert.alert("Evento publicado", "Tu evento ha sido publicado exitosamente.", [
              {
                text: "OK",
                onPress: () => {
                  try {
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
                  } catch (err) {
                    console.error("[PreviewEvent] Error navegando tras publicar:", err);
                  }
                },
              },
            ]);
            setIsPublishing(false);
          },
        },
      ]
    );
  };

  if (!draftEvent && !businessEvent && !detail) {
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

  const eventDate = effectiveDetail
    ? new Date()
    : draftEvent
    ? new Date(draftEvent.dateTime)
    : new Date();
  const ticketsForSelector = effectiveDetail
    ? (effectiveDetail.tickets || []).map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        currency: ticket.currency || "Bs.",
        available: ticket.available,
        isSoldOut: ticket.isSoldOut,
      }))
    : draftEvent
    ? draftEvent.tickets.map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        currency: "Bs.",
        available: ticket.stock > 0,
        isSoldOut: ticket.stock === 0,
      }))
    : isPublishedEvent
    ? ((businessEvent?.tickets || []).map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        price: ticket.price,
        currency: ticket.currency || "Bs.",
        available: Boolean(ticket.available),
        isSoldOut: Boolean(ticket.isSoldOut),
      })))
    : [];
  
  const displayTitle = effectiveDetail ? effectiveDetail.title : isPublishedEvent ? businessEvent?.title : draftEvent?.title;
  const displaySubtitle = effectiveDetail ? effectiveDetail.subtitle : isPublishedEvent ? businessEvent?.subtitle : draftEvent?.subtitle;
  const displayImage = effectiveDetail ? effectiveDetail.image : isPublishedEvent ? businessEvent?.image : draftEvent?.eventImage;
  const displayLocation = effectiveDetail ? effectiveDetail.location.name : isPublishedEvent ? businessEvent?.location : draftEvent?.locationName;
  const displayTags = effectiveDetail ? (effectiveDetail.tags || []) : isPublishedEvent ? (businessEvent?.tags || []) : (draftEvent?.tags || []);
  const attendeesCount = effectiveDetail ? effectiveDetail.attendeesCount : isPublishedEvent ? (businessEvent?.ticketsSold || 0) : 0;
  
  const displayDateLabel = effectiveDetail
    ? effectiveDetail.date
    : isPublishedEvent
    ? ((businessEvent as any)?.startTimeIso
        ? formatDate(new Date((businessEvent as any).startTimeIso))
        : (businessEvent?.date || ""))
    : formatDate(eventDate);
  const displayTimeLabel = effectiveDetail
    ? `${effectiveDetail.dayOfWeek}, ${effectiveDetail.time}`
    : isPublishedEvent
    ? ((businessEvent as any)?.startTimeIso
        ? `${formatDayOfWeek(new Date((businessEvent as any).startTimeIso))}, ${formatTime(new Date((businessEvent as any).startTimeIso))}`
        : ((businessEvent as any)?.dayOfWeekLabel ? `${(businessEvent as any).dayOfWeekLabel}, ${businessEvent?.time || ""}` : (businessEvent?.time || "")))
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
              {(effectiveDetail?.googleMapsLink || draftEvent?.googleMapsLink || (businessEvent as any)?.googleMapsLink) ? (
                <Pressable onPress={() => {
                  const url = effectiveDetail?.googleMapsLink || draftEvent?.googleMapsLink || (businessEvent as any)?.googleMapsLink || "";
                  if (!url) return;
                  Linking.openURL(url).catch((err) => {
                    console.error("[PreviewEvent] Error abriendo Google Maps URL:", err, { url });
                  });
                }}>
                  <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>Ver en Google Maps</ThemedText>
                </Pressable>
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

          {(effectiveDetail?.spotifyPlaylist?.embedUrl || draftEvent?.spotifyUrl || (businessEvent as any)?.spotifyUrl) ? (
            <View style={[styles.section, styles.sectionCompact]}>
              <ThemedText type="h4" style={styles.sectionTitle}>Escuchalo</ThemedText>
              <SpotifyEmbed embedUrl={effectiveDetail?.spotifyPlaylist?.embedUrl || draftEvent?.spotifyUrl || (businessEvent as any)?.spotifyUrl || ""} />
            </View>
          ) : null}

          {(effectiveDetail?.description || draftEvent?.details || (businessEvent as any)?.descriptionHTML) ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Detalles</ThemedText>
              <RichTextRenderer html={(effectiveDetail?.description || draftEvent?.details || (businessEvent as any)?.descriptionHTML || "")} color={theme.text} />
            </View>
          ) : null}

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>Ubicación</ThemedText>
            <View style={{ padding: Spacing.md, backgroundColor: "#F9F9F9", borderRadius: BorderRadius.sm }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: Spacing.sm }}>
                <Feather name="map-pin" size={16} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontSize: 14, fontWeight: "500" }}>{displayLocation}</ThemedText>
                  <ThemedText style={[styles.infoSubLabel, { color: theme.textSecondary }]}>
                    {displayLocation}
                  </ThemedText>
                </View>
              </View>
              <MiniMap
                latitude={effectiveDetail?.location?.latitude ?? (businessEvent as any)?.latitude ?? 0}
                longitude={effectiveDetail?.location?.longitude ?? (businessEvent as any)?.longitude ?? 0}
                locationName={displayLocation || ""}
                address={displayLocation || ""}
              />
            </View>
          </View>

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

          {isPublishedEvent && (businessEvent as any)?.sectorImage ? (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>Mapa de sectores</ThemedText>
              <Image
                source={(businessEvent as any).sectorImage}
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
