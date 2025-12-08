import React, { useState, useCallback, useRef, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/core/hooks/useTheme";
import { MapContainer, MapContainerRef } from "../components/MapContainer";
import { MapEventsCards } from "../components/MapEventsCards";
import { GoogleMapsButton } from "../components/GoogleMapsButton";
import { MAP_EVENTS, MapEvent, CATEGORY_CONFIG } from "../constants/mapEvents";
import { Spacing } from "@/src/core/constants/theme";
import type { MapaStackParamList } from "../navigation/stacks/MapaStack";

const TAB_BAR_HEIGHT = 70;

type NavigationProp = NativeStackNavigationProp<MapaStackParamList>;

export default function MapaScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const mapRef = useRef<MapContainerRef>(null);
  const isFocused = useIsFocused();
  const { selectedCategory } = useHomeHeader();
  const [savedEvents, setSavedEvents] = useState<Set<string>>(
    new Set(MAP_EVENTS.filter((e) => e.isSaved).map((e) => e.id))
  );

  const allEventsWithSaved = MAP_EVENTS.map((e) => ({ ...e, isSaved: savedEvents.has(e.id) }));

  const filteredEvents = selectedCategory
    ? allEventsWithSaved.filter((e) => {
        const config = CATEGORY_CONFIG[e.category];
        return config.label.toLowerCase() === selectedCategory.toLowerCase();
      })
    : allEventsWithSaved;

  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(
    filteredEvents.length > 0 ? filteredEvents[0] : null
  );

  const openEventDetail = useCallback((eventId: string) => {
    const parentNav = navigation.getParent?.();
    if (parentNav) {
      (parentNav as any).navigate("EventDetail", { eventId });
      return;
    }
    (navigation as any).navigate("EventDetail", { eventId });
  }, [navigation]);

  useEffect(() => {
    if (filteredEvents.length > 0) {
      const currentEventInFilter = filteredEvents.find(e => e.id === selectedEvent?.id);
      if (!currentEventInFilter) {
        setSelectedEvent(filteredEvents[0]);
        if (mapRef.current && filteredEvents[0]) {
          mapRef.current.animateToEvent(filteredEvents[0]);
        }
      }
    } else {
      setSelectedEvent(null);
    }
  }, [selectedCategory, filteredEvents.length]);

  const handleEventChange = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
    if (mapRef.current) {
      mapRef.current.animateToEvent(event);
    }
  }, []);

  const handleMarkerSelect = useCallback((event: MapEvent) => {
    setSelectedEvent(event);
  }, []);

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

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;
  const cardsBottomOffset = TAB_BAR_HEIGHT + bottomInset;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>

      <View style={styles.mapWrapper}>
        {isFocused ? (
          <MapContainer
            ref={mapRef}
            events={allEventsWithSaved}
            selectedEventId={selectedEvent?.id}
            selectedCategory={selectedCategory}
            onSelectEvent={handleMarkerSelect}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.backgroundDefault }]} />
        )}

        {selectedEvent && (
          <View style={[styles.googleMapsContainer, { bottom: cardsBottomOffset + Spacing.md + 129 }]}>
            <GoogleMapsButton
              latitude={selectedEvent.coordinate.latitude}
              longitude={selectedEvent.coordinate.longitude}
            />
          </View>
        )}

        <MapEventsCards
          events={filteredEvents}
          selectedEventId={selectedEvent?.id}
          onEventChange={handleEventChange}
          onBookmarkToggle={handleBookmarkToggle}
          onEventPress={(event) => openEventDetail(event.id)}
          bottomInset={cardsBottomOffset + 4}
        />
      </View>
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
  mapWrapper: {
    flex: 1,
  },
  googleMapsContainer: {
    position: "absolute",
    left: Spacing.lg,
    zIndex: 15,
  },
});
