import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { useSavedEvents } from "@/src/core/context/SavedEventsContext";
import { SectionHeader } from "@/src/core/components/MoreSection";
import { EventCard } from "@/src/core/components/EventCard";
import { EventCardSmall } from "@/src/core/components/EventCardSmall";
import { SponsoredBanner } from "@/src/modules/home/components/SponsoredBanner";
import { InviteCard } from "@/src/core/components/InviteCard";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import type { ExplorarStackParamList } from "../navigation/stacks/ExplorarStack";

const GRID_GAP = Spacing.md;
const HORIZONTAL_PADDING = Spacing.xl;

const FEATURED_EVENTS = [
  {
    id: "featured-1",
    title: "Corona y Lu de la Tower",
    location: "Alice Park",
    image: require("@/src/modules/home/assets/corona-lu-tower.jpg"),
  },
  {
    id: "featured-2",
    title: "C.R.O en Concierto",
    location: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "featured-3",
    title: "El Circo - Capítulo Final",
    location: "Alice Park",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },
];

const POPULAR_EVENTS = [
  {
    id: "1",
    title: "C.R.O Concierto",
    date: { day: "11", month: "ABR" },
    location: "Alice Park",
    attendees: 200,
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "2",
    title: "Noche de Música",
    date: { day: "30", month: "SEP" },
    location: "Radius Gallery",
    attendees: 150,
    image: require("@/src/modules/home/assets/levitar.png"),
  },
  {
    id: "3",
    title: "Doble Via en Vivo",
    date: { day: "29", month: "NOV" },
    location: "Alice Park",
    attendees: 320,
    image: require("@/src/modules/home/assets/doble-via.png"),
  },
];

const NEARBY_EVENTS = [
  {
    id: "4",
    title: "El Circo - Capítulo Final",
    date: { day: "23", month: "AGO" },
    location: "Alice Park",
    attendees: 200,
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },
  {
    id: "5",
    title: "Noche de Música",
    date: { day: "30", month: "SEP" },
    location: "Radius Gallery",
    attendees: 150,
    image: require("@/src/modules/home/assets/levitar.png"),
  },
  {
    id: "6",
    title: "Fexco Negocios 2025",
    date: { day: "15", month: "DIC" },
    location: "Centro de Eventos",
    attendees: 95,
    image: require("@/src/modules/home/assets/fexco.jpg"),
  },
];

const FOR_YOU_EVENTS = [
  {
    id: "7",
    title: "C.R.O",
    subtitle: "en Concierto",
    date: { day: "11", month: "ABR" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "8",
    title: "Modo Cumbia",
    subtitle: "18 Kilates y Joseca",
    date: { day: "28", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
  },
  {
    id: "9",
    title: "B-RLIN",
    subtitle: "en Concierto",
    date: { day: "05", month: "OCT" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/brlin.png"),
  },
  {
    id: "10",
    title: "Reik",
    subtitle: "en Concierto",
    date: { day: "06", month: "JUN" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/reik.png"),
  },
  {
    id: "11",
    title: "Oktober Fest",
    subtitle: "",
    date: { day: "25", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/oktober-fest.png"),
  },
  {
    id: "12",
    title: "Pink Friday",
    subtitle: "",
    date: { day: "03", month: "DIC" },
    location: "Noma",
    image: require("@/src/modules/home/assets/pink-friday.png"),
  },
];

type NavigationProp = NativeStackNavigationProp<ExplorarStackParamList>;

export default function ExplorarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { headerHeight } = useHomeHeader();
  const { isSaved, toggleSaved } = useSavedEvents();
  console.debug("[Home][ExplorarScreen] render", { screenWidth });

  const openEventDetail = useCallback((eventId: string) => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      (parentNav as any).navigate("EventDetail", { eventId });
      return;
    }
    (navigation as any).navigate("EventDetail", { eventId });
  }, [navigation]);

  const formatDateTimeForSave = useCallback((event: any) => {
    // event.date can be string or { day, month, weekday }
    if (!event) return undefined;
    if (typeof event.date === "string") {
      const dateStr = event.date.toUpperCase();
      return event.time ? `${dateStr} - ${event.time}` : dateStr;
    }
    if (event.date && typeof event.date.day !== "undefined") {
      const day = event.date.day;
      const month = (event.date.month || "").toString().toUpperCase();
      const weekday = event.date.weekday ? ` - ${event.date.weekday.toString().toUpperCase()}` : "";
      const time = event.time ? ` - ${event.time}` : "";
      return `${day} DE ${month}${weekday}${time}`;
    }
    return event.dateTime ?? undefined;
  }, []);

  const handleBookmarkToggle = useCallback((event: any) => {
    toggleSaved({
      id: event.id,
      title: event.title,
      image: event.image,
      dateTime: formatDateTimeForSave(event),
      location: event.location,
    });
  }, [toggleSaved, formatDateTimeForSave]);

  const cardWidth = useMemo(() => {
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;
  }, [screenWidth]);

  // headerHeight is provided by the navigator's CoreHeader via HomeHeaderContext

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + Spacing.sm }]}
      >
        <View style={styles.featuredContainer}>
          <SponsoredBanner
            events={FEATURED_EVENTS}
            onPress={(event) => openEventDetail(event.id)}
            autoPlayInterval={7000}
          />
        </View>

        <SectionHeader
          title="Popular Ahora"
          onSeeMore={() => console.log("See more popular events")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsContainer}
        >
          {POPULAR_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              image={event.image}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event)}
            />
          ))}
        </ScrollView>

        <View style={styles.inviteContainer}>
          <InviteCard onPress={() => console.log("Invite pressed")} />
        </View>

        <SectionHeader
          title="Cerca tuyo"
          onSeeMore={() => console.log("See more nearby events")}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsContainer}
        >
          {NEARBY_EVENTS.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              image={event.image}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event)}
            />
          ))}
        </ScrollView>

        <SectionHeader
          title="Para ti"
          onSeeMore={() => console.log("See more for you events")}
        />

        <View style={styles.forYouGrid}>
          {FOR_YOU_EVENTS.map((event) => (
            <EventCardSmall
              key={event.id}
              title={event.title}
              subtitle={event.subtitle}
              date={event.date}
              location={event.location}
              image={event.image}
              cardWidth={cardWidth}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event)}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      {/* Header rendered by the Tab Navigator (CoreHeader) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
  },
  featuredContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  eventsContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  inviteContainer: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
  },
  forYouGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
  },
  bottomSpacer: {
    height: 100,
  },
});
