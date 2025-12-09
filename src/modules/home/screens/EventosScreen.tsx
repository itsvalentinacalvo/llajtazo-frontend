import React, { useMemo, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { EventCardSmall } from "@/src/core/components/EventCardSmall";
import { SectionHeaderLocation } from "@/src/modules/home/components/SectionHeaderLocation";
import { SponsoredBanner } from "@/src/modules/home/components/SponsoredBanner";
import { SponsoredRow } from "@/src/modules/home/components/SponsoredRow";
import { Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useScreenInsets } from "@/src/core/hooks/useScreenInsets";
import type { EventosStackParamList } from "../navigation/stacks/EventosStack";

const BANNER_EVENTS = [
  {
    id: "banner1",
    title: "Corona y Lu de la Tower",
    location: "Alice Park",
    image: require("@/src/modules/home/assets/corona-lu-tower.jpg"),
  },
  {
    id: "banner2",
    title: "C.R.O en Concierto",
    location: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
];

const NORMAL_EVENTS = [
  {
    id: "1",
    title: "C.R.O",
    subtitle: "en Concierto",
    date: { day: "19", month: "DIC" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "2",
    title: "Corona y Lu de ...",
    subtitle: "",
    date: { day: "27", month: "DIC" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/corona-lu-tower.jpg"),
  },
  {
    id: "3",
    title: "B-RLIN",
    subtitle: "en Concierto",
    date: { day: "03", month: "DIC" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/brlin.png"),
  },
  {
    id: "4",
    title: "Reik",
    subtitle: "en Concierto",
    date: { day: "14", month: "FEB" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/reik.png"),
  },
  {
    id: "5",
    title: "Modo Cumbia",
    subtitle: "18 Kilates y Joseca",
    date: { day: "06", month: "DIC" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
  },
  {
    id: "6",
    title: "Fexco Negocios",
    subtitle: "",
    date: { day: "20", month: "NOV" },
    location: "Fexco",
    image: require("@/src/modules/home/assets/fexco.jpg"),
  },
  {
    id: "7",
    title: "Levitar",
    subtitle: "Skryption",
    date: { day: "28", month: "NOV" },
    location: "Levitar",
    image: require("@/src/modules/home/assets/levitar.png"),
  },
  {
    id: "8",
    title: "El Circo",
    subtitle: "Capitulo Final",
    date: { day: "15", month: "DIC" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },
  {
    id: "9",
    title: "Noche BRANCA",
    subtitle: "",
    date: { day: "22", month: "DIC" },
    location: "Aura",
    image: require("@/src/modules/home/assets/doble-via.png"),
  },
  {
    id: "10",
    title: "B-RLIN",
    subtitle: "World Tour",
    date: { day: "10", month: "ENE" },
    location: "Stadium",
    image: require("@/src/modules/home/assets/brlin.png"),
  },
  {
    id: "11",
    title: "Reik",
    subtitle: "Acoustic",
    date: { day: "20", month: "ENE" },
    location: "Teatro",
    image: require("@/src/modules/home/assets/reik.png"),
  },
  {
    id: "12",
    title: "Modo Cumbia",
    subtitle: "Live",
    date: { day: "25", month: "ENE" },
    location: "Plaza",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
  },
  {
    id: "13",
    title: "Doble Via",
    subtitle: "en Vivo",
    date: { day: "29", month: "NOV" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/doble-via.png"),
  },
  {
    id: "14",
    title: "C.R.O",
    subtitle: "Tour 2025",
    date: { day: "05", month: "FEB" },
    location: "Coliseo",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "15",
    title: "Corona Fest",
    subtitle: "",
    date: { day: "12", month: "FEB" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/corona-lu-tower.jpg"),
  },
  {
    id: "16",
    title: "El Circo",
    subtitle: "Nueva Temporada",
    date: { day: "18", month: "FEB" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },
  {
    id: "17",
    title: "Fexco Business",
    subtitle: "Summit 2025",
    date: { day: "22", month: "FEB" },
    location: "Centro Eventos",
    image: require("@/src/modules/home/assets/fexco.jpg"),
  },
  {
    id: "18",
    title: "Levitar",
    subtitle: "Night Edition",
    date: { day: "28", month: "FEB" },
    location: "Aura",
    image: require("@/src/modules/home/assets/levitar.png"),
  },
  {
    id: "19",
    title: "B-RLIN",
    subtitle: "Unplugged",
    date: { day: "05", month: "MAR" },
    location: "Teatro Municipal",
    image: require("@/src/modules/home/assets/brlin.png"),
  },
  {
    id: "20",
    title: "Reik",
    subtitle: "Tour Latino",
    date: { day: "12", month: "MAR" },
    location: "Stadium",
    image: require("@/src/modules/home/assets/reik.png"),
  },
  {
    id: "21",
    title: "Modo Cumbia",
    subtitle: "Fiesta Tropical",
    date: { day: "19", month: "MAR" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
  },
  {
    id: "22",
    title: "Noche Latina",
    subtitle: "",
    date: { day: "26", month: "MAR" },
    location: "NOMA",
    image: require("@/src/modules/home/assets/pink-friday.png"),
  },
  {
    id: "23",
    title: "C.R.O",
    subtitle: "Despedida",
    date: { day: "02", month: "ABR" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },
  {
    id: "24",
    title: "Oktober Fest",
    subtitle: "Edicion Especial",
    date: { day: "09", month: "ABR" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/oktober-fest.png"),
  },
];

const SPONSORED_EVENTS = [
  {
    id: "sp1",
    title: "Oktober Fest",
    subtitle: "",
    date: { day: "25", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/oktober-fest.png"),
    sponsor: {
      name: "Euphoria",
      avatar: require("@/src/modules/home/assets/oktober-fest.png"),
    },
  },
  {
    id: "sp2",
    title: "Pink Friday",
    subtitle: "",
    date: { day: "29", month: "NOV" },
    location: "NOMA",
    image: require("@/src/modules/home/assets/pink-friday.png"),
    sponsor: {
      name: "NOMA",
      avatar: require("@/src/modules/home/assets/pink-friday.png"),
    },
  },
  {
    id: "sp3",
    title: "Modo Cumbia",
    subtitle: "Especial",
    date: { day: "17", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
    sponsor: {
      name: "Euphoria",
      avatar: require("@/src/modules/home/assets/oktober-fest.png"),
    },
  },
  {
    id: "sp4",
    title: "Levitar Night",
    subtitle: "",
    date: { day: "30", month: "NOV" },
    location: "Levitar",
    image: require("@/src/modules/home/assets/levitar.png"),
    sponsor: {
      name: "Levitar",
      avatar: require("@/src/modules/home/assets/levitar.png"),
    },
  },
];

type FeedItem =
  | { type: "section" }
  | { type: "normalRow"; events: typeof NORMAL_EVENTS }
  | { type: "sponsoredRow"; events: typeof SPONSORED_EVENTS }
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
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

  const handleBookmarkToggle = useCallback((eventId: string) => {
    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const cardWidth = useMemo(() => {
    return (screenWidth - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;
  }, [screenWidth]);

  // headerHeight provided by navigator's CoreHeader via HomeHeaderContext

  const buildFeedData = (): FeedItem[] => {
    const feedItems: FeedItem[] = [
      { type: "section" },
    ];

    const normalRows: typeof NORMAL_EVENTS[] = [];
    for (let i = 0; i < NORMAL_EVENTS.length; i += 2) {
      normalRows.push(NORMAL_EVENTS.slice(i, i + 2));
    }

    const sponsoredPairs: (typeof SPONSORED_EVENTS)[] = [];
    for (let i = 0; i < SPONSORED_EVENTS.length; i += 2) {
      sponsoredPairs.push(SPONSORED_EVENTS.slice(i, i + 2));
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
  };

  const feedData = buildFeedData();

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
            {item.events.map((event) => (
              <EventCardSmall
                key={event.id}
                title={event.title}
                subtitle={event.subtitle}
                date={event.date}
                location={event.location}
                image={event.image}
                cardWidth={cardWidth}
                isSaved={savedEvents.has(event.id)}
                onPress={() => openEventDetail(event.id)}
                onBookmarkPress={() => handleBookmarkToggle(event.id)}
              />
            ))}
          </View>
        );
      case "sponsoredRow":
        return (
          <SponsoredRow
            events={[item.events[0], item.events[1]]}
            onEventPress={(event) => openEventDetail(event.id)}
          />
        );
      case "sponsoredBanner":
        return (
          <View style={styles.bannerContainer}>
            <SponsoredBanner
              events={BANNER_EVENTS}
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
          if (item.type === "normalRow") return `normal-${item.events[0]?.id}`;
          if (item.type === "sponsoredRow") return `sponsored-${item.events[0]?.id}`;
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
