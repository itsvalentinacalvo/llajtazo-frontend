import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
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

export function CoreTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
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
        {renderIcon()}
        <ThemedText
          style={[
            styles.tabLabel,
            { color: iconColor },
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
