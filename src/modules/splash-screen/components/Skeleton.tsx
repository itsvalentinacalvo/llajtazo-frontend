import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle, DimensionValue, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Colors, BorderRadius, Spacing } from "@/src/core/constants/theme";

const SKELETON_BASE_COLOR = "#E8E8E8";
const SKELETON_HIGHLIGHT_COLOR = "#F5F5F5";
const ANIMATION_DURATION = 1200;

interface SkeletonBaseProps {
  style?: StyleProp<ViewStyle>;
  animate?: boolean;
}

function useSkeletonAnimation(animate: boolean = true) {
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: ANIMATION_DURATION,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        -1,
        false
      );
    }
  }, [animate, shimmerProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [1, 0.6, 1]
    );
    return { opacity };
  });

  return animatedStyle;
}

export function SkeletonBox({ style, animate = true }: SkeletonBaseProps) {
  const animatedStyle = useSkeletonAnimation(animate);

  return (
    <Animated.View
      style={[
        styles.box,
        style,
        animatedStyle,
      ]}
    />
  );
}

interface SkeletonCircleProps extends SkeletonBaseProps {
  size?: number;
}

export function SkeletonCircle({ size = 48, style, animate = true }: SkeletonCircleProps) {
  const animatedStyle = useSkeletonAnimation(animate);

  return (
    <Animated.View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

interface SkeletonTextProps extends SkeletonBaseProps {
  width?: DimensionValue;
  height?: number;
  lines?: number;
  lineSpacing?: number;
}

export function SkeletonText({
  width = "100%",
  height = 14,
  lines = 1,
  lineSpacing = 8,
  style,
  animate = true,
}: SkeletonTextProps) {
  const animatedStyle = useSkeletonAnimation(animate);

  if (lines === 1) {
    return (
      <Animated.View
        style={[
          styles.text,
          {
            width,
            height,
          },
          style,
          animatedStyle,
        ]}
      />
    );
  }

  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.text,
            {
              width: index === lines - 1 ? ("70%" as DimensionValue) : width,
              height,
              marginBottom: index < lines - 1 ? lineSpacing : 0,
            },
            animatedStyle,
          ]}
        />
      ))}
    </View>
  );
}

interface SkeletonCardProps extends SkeletonBaseProps {
  imageHeight?: number;
  showImage?: boolean;
  showAvatar?: boolean;
  titleWidth?: DimensionValue;
  subtitleWidth?: DimensionValue;
}

export function SkeletonCard({
  imageHeight = 120,
  showImage = true,
  showAvatar = false,
  titleWidth = "80%",
  subtitleWidth = "60%",
  style,
  animate = true,
}: SkeletonCardProps) {
  const animatedStyle = useSkeletonAnimation(animate);

  return (
    <View style={[styles.card, style]}>
      {showImage && (
        <Animated.View
          style={[
            styles.cardImage,
            { height: imageHeight },
            animatedStyle,
          ]}
        />
      )}
      <View style={styles.cardContent}>
        {showAvatar && (
          <View style={styles.cardHeader}>
            <SkeletonCircle size={32} animate={animate} />
            <View style={styles.cardHeaderText}>
              <SkeletonText width={100} height={12} animate={animate} />
            </View>
          </View>
        )}
        <SkeletonText width={titleWidth} height={16} animate={animate} style={{ marginBottom: Spacing.sm }} />
        <SkeletonText width={subtitleWidth} height={12} animate={animate} />
      </View>
    </View>
  );
}

interface SkeletonAvatarWithTextProps extends SkeletonBaseProps {
  avatarSize?: number;
  titleWidth?: DimensionValue;
  subtitleWidth?: DimensionValue;
}

export function SkeletonAvatarWithText({
  avatarSize = 48,
  titleWidth = 120,
  subtitleWidth = 80,
  style,
  animate = true,
}: SkeletonAvatarWithTextProps) {
  return (
    <View style={[styles.avatarWithText, style]}>
      <SkeletonCircle size={avatarSize} animate={animate} />
      <View style={styles.avatarTextContainer}>
        <SkeletonText width={titleWidth} height={14} animate={animate} style={{ marginBottom: Spacing.xs }} />
        <SkeletonText width={subtitleWidth} height={12} animate={animate} />
      </View>
    </View>
  );
}

interface SkeletonPillProps extends SkeletonBaseProps {
  width?: number;
  height?: number;
}

export function SkeletonPill({
  width = 80,
  height = 32,
  style,
  animate = true,
}: SkeletonPillProps) {
  const animatedStyle = useSkeletonAnimation(animate);

  return (
    <Animated.View
      style={[
        styles.pill,
        {
          width,
          height,
          borderRadius: height / 2,
        },
        style,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: SKELETON_BASE_COLOR,
    borderRadius: BorderRadius.sm,
  },
  circle: {
    backgroundColor: SKELETON_BASE_COLOR,
  },
  text: {
    backgroundColor: SKELETON_BASE_COLOR,
    borderRadius: BorderRadius.xs,
  },
  textContainer: {
    flexDirection: "column",
  },
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  cardImage: {
    backgroundColor: SKELETON_BASE_COLOR,
    width: "100%",
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  cardHeaderText: {
    marginLeft: Spacing.sm,
  },
  avatarWithText: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarTextContainer: {
    marginLeft: Spacing.md,
  },
  pill: {
    backgroundColor: SKELETON_BASE_COLOR,
  },
});

export default {
  Box: SkeletonBox,
  Circle: SkeletonCircle,
  Text: SkeletonText,
  Card: SkeletonCard,
  AvatarWithText: SkeletonAvatarWithText,
  Pill: SkeletonPill,
};
