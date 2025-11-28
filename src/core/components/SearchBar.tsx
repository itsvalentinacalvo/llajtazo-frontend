import React from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";

interface SearchBarProps {
  placeholder?: string;
  onSearchChange?: (text: string) => void;
  onFilterPress?: () => void;
}

export function SearchBar({
  placeholder = "Buscar",
  onSearchChange,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={20}
          color="#FFFFFF"
          style={styles.searchIcon}
        />
        <View style={styles.searchInput}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            style={styles.input}
            onChangeText={onSearchChange}
          />
        </View>
      </View>

      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          styles.filterButton,
          pressed && styles.pressed,
        ]}
      >
        <Feather name="sliders" size={20} color="#FFFFFF" />
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
});
