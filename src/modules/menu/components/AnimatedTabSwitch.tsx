import React from "react";
import { View, Pressable, StyleSheet, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";

interface Tab {
  key: string;
  label: string;
}

interface AnimatedTabSwitchProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

const springConfig: WithSpringConfig = {
  damping: 18,
  mass: 0.8,
  stiffness: 180,
  overshootClamping: false,
};

export function AnimatedTabSwitch({
  tabs,
  activeTab,
  onTabChange,
}: AnimatedTabSwitchProps) {
  const { theme } = useTheme();
  const containerWidth = useSharedValue(0);
  const tabWidth = useSharedValue(0);
  const translateX = useSharedValue(0);

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidth.value = width;
    tabWidth.value = width / tabs.length;
    translateX.value = withSpring(
      (width / tabs.length) * activeIndex,
      springConfig
    );
  };

  const handleTabPress = (tabKey: string, index: number) => {
    translateX.value = withSpring(tabWidth.value * index, springConfig);
    onTabChange(tabKey);
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: tabWidth.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      onLayout={handleLayout}
    >
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: theme.primary },
          indicatorStyle,
        ]}
      />
      {tabs.map((tab, index) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.key, index)}
          >
            <ThemedText
              style={[
                styles.tabText,
                { color: isActive ? theme.white : theme.textSecondary },
              ]}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.xl,
    padding: 4,
    position: "relative",
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    overflow: "hidden",
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: BorderRadius.xl - 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
