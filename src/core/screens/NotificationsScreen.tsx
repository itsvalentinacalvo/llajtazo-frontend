import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors, Spacing, Typography } from "@/src/core/constants/theme";
import { PRIMARY_TEST_USER } from "@/src/core/test/testDatabase";
import { getNotificationsForUser, NotificationItem } from "@/src/core/test/notificationsData";

const STAR_COLOR = "#FFCD6C";
const STAR_SIZE = 18;

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
}

interface StarIconProps {
  scale: SharedValue<number>;
  filled: boolean;
  onPress: () => void;
}

function StarIcon({ scale, filled, onPress }: StarIconProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
    >
      <Animated.View style={animatedStyle}>
        <FontAwesome5
          name="star"
          size={STAR_SIZE}
          color={STAR_COLOR}
          solid={filled}
        />
      </Animated.View>
    </Pressable>
  );
}

function StarRating({ rating, onRatingChange }: StarRatingProps) {
  const [currentRating, setCurrentRating] = useState(rating);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);
  const scale5 = useSharedValue(1);
  const scales = useMemo(
    () => [scale1, scale2, scale3, scale4, scale5],
    [scale1, scale2, scale3, scale4, scale5]
  );

  const handleStarPress = useCallback((index: number) => {
    const newRating = index + 1;
    setCurrentRating(newRating);

    // Reset any ongoing animations to avoid bounce loops
    for (const s of scales) {
      s.value = 1;
    }

    // Quick, non-bouncy pop animation on the pressed star
    scales[index].value = withSequence(
      withTiming(1.15, { duration: 120 }),
      withTiming(1, { duration: 120 })
    );

    onRatingChange?.(newRating);
  }, [onRatingChange, scales]);

  return (
    <View style={starStyles.container}>
      {scales.map((scale, index) => (
        <StarIcon
          key={index}
          scale={scale}
          filled={index < currentRating}
          onPress={() => handleStarPress(index)}
        />
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    marginTop: Spacing.xs,
  },
});

interface NotificationRowProps {
  item: NotificationItem;
  onRatingChange?: (eventId: string, rating: number) => void;
}

function NotificationRow({ item, onRatingChange }: NotificationRowProps) {
  const handleRatingChange = useCallback((rating: number) => {
    if (item.eventId) {
      onRatingChange?.(item.eventId, rating);
    }
  }, [item.eventId, onRatingChange]);

  return (
    <View style={rowStyles.container}>
      <Image
        source={item.image}
        style={rowStyles.avatar}
        contentFit="cover"
        transition={200}
      />
      <View style={rowStyles.content}>
        <ThemedText style={rowStyles.text}>
          <ThemedText style={rowStyles.title}>{item.title}</ThemedText>
          {item.highlightedText ? (
            <>
              {" "}
              <ThemedText style={rowStyles.highlighted}>{item.highlightedText}</ThemedText>
            </>
          ) : null}
          {" "}
          {item.message}
        </ThemedText>
        
        {item.type === "opinion_request" && item.rating !== undefined ? (
          <StarRating
            rating={item.rating}
            onRatingChange={handleRatingChange}
          />
        ) : null}
        
        {item.timeAgo ? (
          <ThemedText style={rowStyles.timeAgo}>{item.timeAgo}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    ...Typography.body,
    color: Colors.light.text,
    lineHeight: 20,
  },
  title: {
    fontWeight: "600",
  },
  highlighted: {
    fontWeight: "700",
    color: Colors.light.text,
  },
  timeAgo: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
});

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Image
        source={require("@/src/core/assets/bell-empty.png")}
        style={emptyStyles.image}
        contentFit="contain"
      />
      <ThemedText style={emptyStyles.title}>Sin Notificaciones!</ThemedText>
      <ThemedText style={emptyStyles.subtitle}>
        Aqui veras publicaciones o{"\n"}actualizaciones sobre los eventos de tu{"\n"}interes
      </ThemedText>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const userId = PRIMARY_TEST_USER.id;
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getNotificationsForUser(userId)
  );
  const loadNotifications = useCallback(
    () => getNotificationsForUser(userId),
    [userId]
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setNotifications(loadNotifications());
    setRefreshing(false);
  }, [loadNotifications]);

  const handleRatingChange = useCallback((eventId: string, rating: number) => {
    console.log(`Rating changed for event ${eventId}: ${rating} stars`);
  }, []);

  const renderItem = useCallback(({ item }: { item: NotificationItem }) => (
    <NotificationRow item={item} onRatingChange={handleRatingChange} />
  ), [handleRatingChange]);

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.text} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Notificaciones</ThemedText>
        <Pressable
          style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="more-vertical" size={20} color={Colors.light.text} />
        </Pressable>
      </View>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.light.primary}
              colors={[Colors.light.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.light.text,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  listContent: {
    paddingTop: Spacing.sm,
  },
});
