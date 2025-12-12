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
import { FEATURED_EVENTS, POPULAR_EVENTS, NEARBY_EVENTS, FOR_YOU_EVENTS, findEventById } from "@/src/core/test/events";
import { useTheme } from "@/src/core/hooks/useTheme";
import type { ExplorarStackParamList } from "../navigation/stacks/ExplorarStack";

const GRID_GAP = Spacing.md;
const HORIZONTAL_PADDING = Spacing.xl;



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

  const handleBookmarkToggle = useCallback((eventId: string) => {
    const ev = findEventById(eventId);
    if (!ev) return;
    toggleSaved({
      id: ev.id,
      title: ev.title,
      subtitle: ev.subtitle,
      image: ev.image,
      dateTime: formatDateTimeForSave(ev),
      location: ev.location,
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
            events={FEATURED_EVENTS.map((e) => ({ ...e, location: e.location ?? "", image: e.image! })) as any}
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
              eventId={event.id}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event.id)}
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
              eventId={event.id}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event.id)}
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
              eventId={event.id}
              cardWidth={cardWidth}
              isSaved={isSaved(event.id)}
              onPress={() => openEventDetail(event.id)}
              onBookmarkPress={() => handleBookmarkToggle(event.id)}
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
