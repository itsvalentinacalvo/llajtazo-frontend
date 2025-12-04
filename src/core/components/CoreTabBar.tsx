import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, Typography } from "@/src/core/constants/theme";

type IconFamily = "ionicons" | "fontawesome" | "fontawesome6";

interface TabConfig {
  name: string;
  label: string;
  icon: string;
  iconFamily: IconFamily;
}

const TAB_CONFIG: TabConfig[] = [
  { name: "ExplorarTab", label: "Explorar", icon: "compass", iconFamily: "ionicons" },
  { name: "EventosTab", label: "Eventos", icon: "calendar", iconFamily: "ionicons" },
  { name: "MapaTab", label: "Mapa", icon: "location-dot", iconFamily: "fontawesome6" },
  { name: "PerfilTab", label: "Perfil", icon: "user", iconFamily: "fontawesome" },
];

const ANIMATION_DURATION = 200;

interface AnimatedTabItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  previousIndex: number;
  currentIndex: number;
}

function AnimatedTabItem({
  route,
  index,
  isFocused,
  options,
  onPress,
  onLongPress,
  previousIndex,
  currentIndex,
}: AnimatedTabItemProps) {
  const { theme } = useTheme();
  const animationProgress = useSharedValue(isFocused ? 1 : 0);
  const direction = currentIndex > previousIndex ? 1 : -1;
  const translateDirection = index >= currentIndex ? 1 : -1;

  const tabConfig = TAB_CONFIG.find((t) => t.name === route.name);

  useEffect(() => {
    animationProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isFocused, animationProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animationProgress.value, [0, 0.5, 1], [0.6, 0.8, 1]);
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [translateDirection * 3, 0]
    );
    const scale = interpolate(animationProgress.value, [0, 1], [0.95, 1]);

    return {
      opacity,
      transform: [{ translateX }, { scale }],
    };
  });

  if (!tabConfig) return null;

  const iconColor = isFocused ? theme.tabIconSelected : theme.tabIconDefault;

  const renderIcon = () => {
    switch (tabConfig.iconFamily) {
      case "ionicons":
        return <Ionicons name={tabConfig.icon as any} size={24} color={iconColor} />;
      case "fontawesome":
        return <FontAwesome name={tabConfig.icon as any} size={24} color={iconColor} />;
      case "fontawesome6":
        return <FontAwesome6 name={tabConfig.icon as any} size={24} color={iconColor} />;
      default:
        return null;
    }
  };

  return (
    <Pressable
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabItemContent, animatedStyle]}>
        {renderIcon()}
        <ThemedText
          style={[
            styles.tabLabel,
            { color: iconColor },
          ]}
        >
          {tabConfig.label}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

function CoreTabBarImpl({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const previousIndexRef = useRef(state.index);

  console.debug("[Core][CoreTabBar] render", { index: state.index, routes: state.routes.map(r => r.name) });

  useEffect(() => {
    previousIndexRef.current = state.index;
  }, [state.index]);

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <AnimatedTabItem
        key={route.key}
        route={route}
        index={index}
        isFocused={isFocused}
        options={options}
        onPress={onPress}
        onLongPress={onLongPress}
        previousIndex={previousIndexRef.current}
        currentIndex={state.index}
      />
    );
  };

  const containerStyle = [
    styles.container,
    {
      paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.lg,
      backgroundColor: "#FFFFFF",
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.tabsRow}>
        {state.routes.map(renderTab)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0,
    elevation: 0,
  },
  tabsRow: {
    flexDirection: "row",
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
  },
  tabItemContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: Typography.tabLabel.fontSize,
    fontWeight: Typography.tabLabel.fontWeight as any,
    marginTop: 4,
  },
});

export const CoreTabBar = React.memo(CoreTabBarImpl);

export default CoreTabBar;
