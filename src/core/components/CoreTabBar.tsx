import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, Typography } from "@/src/core/constants/theme";

type TabIconName = "compass" | "calendar" | "map" | "user";

interface TabConfig {
  name: string;
  label: string;
  icon: TabIconName;
}

const TAB_CONFIG: TabConfig[] = [
  { name: "ExplorarTab", label: "Explorar", icon: "compass" },
  { name: "EventosTab", label: "Eventos", icon: "calendar" },
  { name: "MapaTab", label: "Mapa", icon: "map" },
  { name: "PerfilTab", label: "Perfil", icon: "user" },
];

export function CoreTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === index;
    const tabConfig = TAB_CONFIG.find((t) => t.name === route.name);

    if (!tabConfig) return null;

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
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tabItem}
      >
        <Feather
          name={tabConfig.icon}
          size={24}
          color={isFocused ? theme.tabIconSelected : theme.tabIconDefault}
        />
        <ThemedText
          style={[
            styles.tabLabel,
            { color: isFocused ? theme.tabIconSelected : theme.tabIconDefault },
          ]}
        >
          {tabConfig.label}
        </ThemedText>
      </Pressable>
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
  tabLabel: {
    fontSize: Typography.tabLabel.fontSize,
    fontWeight: Typography.tabLabel.fontWeight as any,
    marginTop: 4,
  },
});
