import React from "react";
import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface SearchBarProps {
  placeholder?: string;
  onSearchChange?: (text: string) => void;
  onFilterPress?: () => void;
  variant?: "dark" | "light"; // dark = white-on-colored bg (default), light = colored controls on light bg
  showFilterLabel?: boolean;
  filterLabel?: string;
  accentColor?: string;
}

export function SearchBar({
  placeholder = "Buscar",
  onSearchChange,
  onFilterPress,
  variant = "dark",
  showFilterLabel = false,
  filterLabel = "Filtros",
  accentColor,
}: SearchBarProps) {
  const { theme } = useTheme();

  const isLight = variant === "light";

  const searchBarStyle = isLight
    ? { backgroundColor: theme.inputBackground, borderColor: accentColor ?? theme.inputBorder }
    : {};

  const inputStyle = isLight ? { color: theme.text } : {};

  const searchIconColor = accentColor ?? (isLight ? theme.primary : "#FFFFFF");

  const placeholderColor = isLight ? (accentColor ? `${accentColor}B3` : "rgba(0,0,0,0.35)") : "rgba(255, 255, 255, 0.7)";

  return (
    <View style={styles.container}>
      <View style={[styles.searchBar, searchBarStyle]}>
        <Feather name="search" size={20} color={searchIconColor} style={styles.searchIcon} />
        <View style={styles.searchInput}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            style={[styles.input, inputStyle]}
            onChangeText={(text) => {
              console.debug("[Core][SearchBar] onSearchChange", text);
              onSearchChange && onSearchChange(text);
            }}
          />
        </View>
      </View>

      <Pressable
        onPress={() => {
          console.debug("[Core][SearchBar] filter pressed");
          onFilterPress && onFilterPress();
        }}
        style={({ pressed }) => [
          showFilterLabel
            ? [styles.filterPill, { backgroundColor: accentColor ?? theme.primary }]
            : [
                styles.filterButton,
                { borderWidth: 1, borderColor: accentColor ?? theme.primary, backgroundColor: "transparent" },
              ],
          pressed && styles.pressed,
        ]}
      >
        <Feather name="sliders" size={20} color={accentColor ?? (showFilterLabel ? "#FFFFFF" : "#FFFFFF")} />
        {showFilterLabel && <Text style={styles.filterLabel}>{filterLabel}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  filterButton: {
    width: Spacing.inputHeight,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  filterPill: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  filterLabel: {
    color: "#FFFFFF",
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: "600",
  },
});
