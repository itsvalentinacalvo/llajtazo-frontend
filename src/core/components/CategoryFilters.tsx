import React from "react";
import { StyleSheet, ScrollView, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, Shadows } from "@/src/core/constants/theme";

export interface Category {
  label: string;
  icon: "book" | "music" | "shopping-bag" | "star" | "heart" | "film" | "coffee";
  color: string;
}

interface CategoryPillProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  isSelected?: boolean;
  onPress?: () => void;
}

function CategoryPill({
  label,
  icon,
  color,
  isSelected,
  onPress,
}: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pillContainer,
        Shadows.categoryPill,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.pillContent, { backgroundColor: color }]}>
        <Feather name={icon} size={20} color="#FFFFFF" style={styles.pillIcon} />
        <ThemedText style={styles.pillLabel}>{label}</ThemedText>
      </View>
    </Pressable>
  );
}

interface CategoryFiltersProps {
  categories?: Category[];
  selectedCategory?: string;
  onCategoryPress?: (label: string) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { label: "Cultura", icon: "book", color: "#FF6B6B" },
  { label: "Música", icon: "music", color: "#FFA85C" },
  { label: "Ferias", icon: "shopping-bag", color: "#5DD9A4" },
];

export function CategoryFilters({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onCategoryPress,
}: CategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scroll}
    >
      {categories.map((category) => (
        <CategoryPill
          key={category.label}
          label={category.label}
          icon={category.icon}
          color={category.color}
          isSelected={selectedCategory === category.label}
          onPress={() => onCategoryPress?.(category.label)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: Spacing.lg,
  },
  container: {
    paddingRight: Spacing.xl,
  },
  pillContainer: {
    height: 42,
    borderRadius: 21,
    marginRight: Spacing.md,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.7,
  },
  pillContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: "100%",
  },
  pillIcon: {
    marginRight: 8,
  },
  pillLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
