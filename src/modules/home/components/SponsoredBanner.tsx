import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, ImageSourcePropType, Dimensions, Image } from "react-native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Image as ExpoImage } from "expo-image";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BANNER_WIDTH = SCREEN_WIDTH - Spacing.xl * 2;

interface SponsoredBannerEvent {
  id: string;
  title: string;
  location: string;
  image: ImageSourcePropType;
}

interface SponsoredBannerProps {
  events: SponsoredBannerEvent[];
  onPress?: (event: SponsoredBannerEvent) => void;
  autoPlayInterval?: number;
}

export function SponsoredBanner({ 
  events, 
  onPress,
  autoPlayInterval = 7000 
}: SponsoredBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateDisplayIndex = (index: number) => {
    setDisplayIndex(index);
  };

  useEffect(() => {
    if (events.length <= 1) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % events.length;
      setCurrentIndex(nextIndex);
      
      opacity.value = withTiming(0, { duration: 200, easing: Easing.ease });
      translateX.value = withTiming(-50, { duration: 200, easing: Easing.ease }, () => {
        runOnJS(updateDisplayIndex)(nextIndex);
        translateX.value = 50;
        opacity.value = withTiming(1, { duration: 300, easing: Easing.ease });
        translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
      });
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events.length, autoPlayInterval, currentIndex]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const currentEvent = events[displayIndex];

  if (!currentEvent) return null;

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <ExpoImage
          key={event.id}
          source={event.image}
          style={styles.preloadImage}
          cachePolicy="memory-disk"
        />
      ))}
      <Animated.View style={[styles.bannerWrapper, animatedStyle]}>
        <Pressable
          onPress={() => onPress?.(currentEvent)}
          style={({ pressed }) => [
            styles.banner,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.imageContainer}>
            <ExpoImage
              source={currentEvent.image}
              style={styles.backgroundImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
            />
            <LinearGradient
              colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
              style={styles.gradient}
            >
              <View style={styles.content}>
                <ThemedText style={styles.title}>{currentEvent.title}</ThemedText>
                <ThemedText style={styles.location}>en {currentEvent.location}</ThemedText>
                <Pressable 
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                  ]} 
                  onPress={() => onPress?.(currentEvent)}
                >
                  <ThemedText style={styles.buttonText}>VER MÁS</ThemedText>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </Pressable>
      </Animated.View>

      {events.length > 1 ? (
        <View style={styles.indicators}>
          {events.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  preloadImage: {
    width: 0,
    height: 0,
    position: "absolute",
  },
  bannerWrapper: {
    width: "100%",
    overflow: "hidden",
    borderRadius: BorderRadius.lg,
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.9,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.lg,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: Spacing.lg,
  },
  content: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: "#2BBBFF",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  indicatorActive: {
    backgroundColor: "#2BBBFF",
    width: 20,
  },
});
