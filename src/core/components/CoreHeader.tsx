import React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { TopBar } from "./TopBarHamburgerMenu&Notif";
import { SearchBar } from "./SearchBar";
import { CategoryFilters, Category } from "./CategoryFilters";

interface CoreHeaderProps {
  onNotificationPress?: () => void;
  onSearchChange?: (text: string) => void;
  onFilterPress?: () => void;
  onCategoryPress?: (label: string) => void;
  selectedCategory?: string;
  categories?: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { label: "Cultura", icon: "book", color: "#FF6B6B" },
  { label: "Música", icon: "music", color: "#FFA85C" },
  { label: "Ferias", icon: "shopping-bag", color: "#5DD9A4" },
];

export function CoreHeader({
  onNotificationPress,
  onSearchChange,
  onFilterPress,
  onCategoryPress,
  selectedCategory,
  categories = DEFAULT_CATEGORIES,
}: CoreHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#2BBBFF", "#1DA8E6"]}
      style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TopBar onNotificationPress={onNotificationPress} />
      <SearchBar
        onSearchChange={onSearchChange}
        onFilterPress={onFilterPress}
      />
      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={onCategoryPress}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2BBBFF",
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
});
