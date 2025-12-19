import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { useSavedEvents } from "@/src/core/context/SavedEventsContext";
import { EventCardSmall } from "@/src/core/components/EventCardSmall";
import { SectionHeaderLocation } from "@/src/modules/home/components/SectionHeaderLocation";
import { SponsoredBanner } from "@/src/modules/home/components/SponsoredBanner";
import { SponsoredRow } from "@/src/modules/home/components/SponsoredRow";
import { Spacing } from "@/src/core/constants/theme";
import { BANNER_EVENTS, NORMAL_EVENTS, SPONSORED_EVENTS, findEventById } from "@/src/core/test/events";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useScreenInsets } from "@/src/core/hooks/useScreenInsets";
import type { EventosStackParamList } from "../navigation/stacks/EventosStack";





type FeedItem =
  | { type: "section" }
  | { type: "normalRow"; events: any[] }
  | { type: "sponsoredRow"; events: any[] }
  | { type: "sponsoredBanner" };

const GRID_GAP = Spacing.md;
const HORIZONTAL_PADDING = Spacing.xl;

type NavigationProp = NativeStackNavigationProp<EventosStackParamList>;

export default function EventosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { headerHeight } = useHomeHeader();
  const { theme } = useTheme();
  const { paddingBottom } = useScreenInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { isSaved, toggleSaved } = useSavedEvents();

  const formatDateTimeForSave = useCallback((event: any) => {
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

  // headerHeight provided by navigator's CoreHeader via HomeHeaderContext

  const shuffle = useCallback(<T,>(array: T[]): T[] => {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  const buildExtendedIds = useCallback((events: any[], repeat: number): string[] => {
    const ids = events.map((e) => e.id);
    let extended: string[] = [];
    for (let r = 0; r < repeat; r++) {
      extended = extended.concat(shuffle(ids));
    }
    return extended;
  }, [shuffle]);

  const buildFeedData = useCallback((): FeedItem[] => {
    const feedItems: FeedItem[] = [{ type: "section" }];

    const normalIds = buildExtendedIds(NORMAL_EVENTS as any[], 3);
    const sponsoredIds = buildExtendedIds(SPONSORED_EVENTS as any[], 2);

    const normalRows: string[][] = [];
    for (let i = 0; i < normalIds.length; i += 2) {
      normalRows.push(normalIds.slice(i, i + 2));
    }

    const sponsoredPairs: string[][] = [];
    for (let i = 0; i < sponsoredIds.length; i += 2) {
      sponsoredPairs.push(sponsoredIds.slice(i, i + 2));
    }

    let sponsoredIndex = 0;
    let sponsoredTypeToggle = 0;

    normalRows.forEach((row, index) => {
      feedItems.push({ type: "normalRow", events: row });

      if ((index + 1) % 3 === 0) {
        if (sponsoredTypeToggle % 2 === 0) {
          if (sponsoredIndex < sponsoredPairs.length) {
            feedItems.push({ type: "sponsoredRow", events: sponsoredPairs[sponsoredIndex] });
            sponsoredIndex++;
          }
        } else {
          feedItems.push({ type: "sponsoredBanner" });
        }
        sponsoredTypeToggle++;
      }
    });

    return feedItems;
  }, [buildExtendedIds]);

  const feedData = useMemo(() => buildFeedData(), [buildFeedData]);

  console.debug("[Home][EventosScreen] render", { feedItems: feedData.length });

  const openEventDetail = useCallback((eventId: string) => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      (parentNav as any).navigate("EventDetail", { eventId });
      return;
    }
    (navigation as any).navigate("EventDetail", { eventId });
  }, [navigation]);

  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case "section":
        return (
          <SectionHeaderLocation
            title="Para ti"
            location="Cochabamba"
            distance="5 km"
          />
        );
      case "normalRow":
        return (
          <View style={styles.gridRow}>
            {item.events.map((eventId, idx) => (
              <EventCardSmall
                key={`${eventId}-${idx}`}
                eventId={eventId}
                cardWidth={cardWidth}
                isSaved={isSaved(eventId)}
                onPress={() => openEventDetail(eventId)}
                onBookmarkPress={() => handleBookmarkToggle(eventId)}
              />
            ))}
          </View>
        );
      case "sponsoredRow":
        return (
          <SponsoredRow
            events={item.events as [string, string?]}
            onEventPress={(eventId) => openEventDetail(eventId)}
          />
        );
      case "sponsoredBanner":
        return (
          <View style={styles.bannerContainer}>
            <SponsoredBanner
              events={BANNER_EVENTS.map((e) => ({ ...e, location: e.location ?? "", image: e.image! })) as any}
              onPress={(event) => openEventDetail(event.id)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (item.type === "section") return "section";
          if (item.type === "normalRow") return `normal-${index}`;
          if (item.type === "sponsoredRow") return `sponsored-${index}`;
          if (item.type === "sponsoredBanner") return `banner-${index}`;
          return `item-${index}`;
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom }}
      />
      {/* Header rendered by Tab Navigator */}
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
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
  },
  bannerContainer: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
  },
});
