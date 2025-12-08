import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Octicons, FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/src/core/constants/theme";
import { MapEvent } from "../constants/mapEvents";

const CARD_WIDTH_RATIO = 0.92;
const CARD_HEIGHT = 110;
const IMAGE_SIZE = 90;

interface MapEventsCardsProps {
  events: MapEvent[];
  selectedEventId?: string;
  onEventChange: (event: MapEvent) => void;
  onBookmarkToggle?: (eventId: string) => void;
  onEventPress?: (event: MapEvent) => void;
  bottomInset?: number;
}

export function MapEventsCards({
  events,
  selectedEventId,
  onEventChange,
  onBookmarkToggle,
  onEventPress,
  bottomInset = 0,
}: MapEventsCardsProps) {
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  console.debug("[Home][MapEventsCards] render", { eventsLength: events?.length, selectedEventId });
  const [isScrollingFromMarker, setIsScrollingFromMarker] = useState(false);

  const cardWidth = screenWidth * CARD_WIDTH_RATIO;
  const horizontalPadding = (screenWidth - cardWidth) / 2;
  const snapInterval = cardWidth + Spacing.md;

  const selectedIndex = events.findIndex((e) => e.id === selectedEventId);

  useEffect(() => {
    if (selectedIndex >= 0 && flatListRef.current) {
      setIsScrollingFromMarker(true);
      flatListRef.current.scrollToOffset({
        offset: selectedIndex * snapInterval,
        animated: true,
      });
      setTimeout(() => setIsScrollingFromMarker(false), 300);
    }
  }, [selectedEventId, selectedIndex, snapInterval]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingFromMarker) return;

      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      const clampedIndex = Math.max(0, Math.min(index, events.length - 1));

      if (events[clampedIndex] && events[clampedIndex].id !== selectedEventId) {
        onEventChange(events[clampedIndex]);
      }
    },
    [events, selectedEventId, onEventChange, snapInterval, isScrollingFromMarker]
  );

  const renderCard = ({ item, index }: { item: MapEvent; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === events.length - 1;

    return (
      <Pressable
        onPress={() => onEventPress?.(item)}
        style={({ pressed }) => [
          styles.cardWrapper,
          {
            width: cardWidth,
            marginLeft: isFirst ? horizontalPadding : Spacing.md / 2,
            marginRight: isLast ? horizontalPadding : Spacing.md / 2,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.card}>
          <Image
            source={item.image}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />

          <View style={styles.cardContent}>
            <View style={styles.dateRow}>
              <ThemedText style={styles.dateText}>
                {item.date} <ThemedText style={styles.timeDot}>•</ThemedText> {item.time}
              </ThemedText>
            </View>

            <ThemedText style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </ThemedText>

            <View style={styles.locationRow}>
              <View style={styles.locationPin}>
                <FontAwesome6 name="location-dot" size={12} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.locationText} numberOfLines={1}>
                {item.location}
              </ThemedText>
            </View>
          </View>

          <Pressable
            style={styles.bookmarkButton}
            onPress={() => onBookmarkToggle?.(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Octicons
              name={item.isSaved ? "bookmark-filled" : "bookmark"}
              size={18}
              color={item.isSaved ? Colors.light.error : Colors.light.textSecondary}
            />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (events.length === 0) {
    return (
      <View style={[styles.emptyContainer, { bottom: bottomInset + Spacing.md }]}>
        <ThemedText style={styles.emptyText}>No hay eventos para mostrar</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { bottom: bottomInset + Spacing.md }]}>
      <FlatList
        ref={flatListRef}
        data={events}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.index * snapInterval,
              animated: true,
            });
          }, 100);
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 20,
  },
  listContent: {
    paddingVertical: Spacing.xs,
  },
  emptyContainer: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    zIndex: 20,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  cardWrapper: {
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    paddingLeft: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
    ...Shadows.card,
  },
  cardImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.lg,
  },
  cardContent: {
    flex: 1,
    paddingLeft: Spacing.md,
    justifyContent: "center",
    gap: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.light.primary,
  },
  timeDot: {
    color: Colors.light.primary,
    fontWeight: "400",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationPin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  bookmarkButton: {
    position: "absolute",
    top: 14,
    right: 19,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
