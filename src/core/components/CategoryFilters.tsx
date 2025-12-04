import React from "react";
import { StyleSheet, ScrollView, Pressable, View, ImageSourcePropType } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, Shadows, CategoryPillColors } from "@/src/core/constants/theme";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";

type IconLibrary = "feather" | "material" | "ionicons" | "fontawesome" | "image";

type CategoryIconConfig = {
  icon: string;
  iconLibrary: IconLibrary;
};

const DEFAULT_CATEGORY_ICON: CategoryIconConfig = {
  icon: "tag",
  iconLibrary: "feather",
};

const CATEGORY_ICON_MAP: Partial<Record<string, CategoryIconConfig>> = {
  Musica: { icon: "music", iconLibrary: "feather" },
  Cultura: { icon: "book-open", iconLibrary: "feather" },
  Ferias: { icon: "shopping-bag", iconLibrary: "feather" },
  Arte: { icon: "image", iconLibrary: "feather" },
  Danza: { icon: "activity", iconLibrary: "feather" },
};

function getCategoryIcon(label: string): CategoryIconConfig {
  return CATEGORY_ICON_MAP[label] ?? DEFAULT_CATEGORY_ICON;
}

export interface Category {
  id?: number;
  label: string;
  icon: string | ImageSourcePropType;
  iconLibrary: IconLibrary;
  color: string;
}

interface CategoryPillProps {
  label: string;
  icon: string | ImageSourcePropType;
  iconLibrary: IconLibrary;
  color: string;
  isSelected?: boolean;
  isLast?: boolean;
  onPress?: () => void;
}

function CategoryIcon({ icon, iconLibrary, size, color }: { icon: string | ImageSourcePropType; iconLibrary: IconLibrary; size: number; color: string }) {
  switch (iconLibrary) {
    case "image":
      return <Image source={icon as ImageSourcePropType} style={{ width: size, height: size }} contentFit="contain" />;
    case "material":
      return <MaterialCommunityIcons name={icon as any} size={size} color={color} />;
    case "ionicons":
      return <Ionicons name={icon as any} size={size} color={color} />;
    case "fontawesome":
      return <FontAwesome name={icon as any} size={size} color={color} />;
    case "feather":
    default:
      return <Feather name={icon as any} size={size} color={color} />;
  }
}

function CategoryPill({
  label,
  icon,
  iconLibrary,
  color,
  isSelected,
  isLast,
  onPress,
}: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pillContainer,
        Shadows.categoryPill,
        isLast && styles.pillContainerLast,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.pillContent, { backgroundColor: color }]}>
        <View style={styles.pillIcon}>
          <CategoryIcon icon={icon} iconLibrary={iconLibrary} size={20} color="#FFFFFF" />
        </View>
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

const DEFAULT_CATEGORIES: Category[] = TEST_DATABASE.categorias.map((category, index) => {
  const iconConfig = getCategoryIcon(category.nombre);
  return {
    id: category.id,
    label: category.nombre,
    icon: iconConfig.icon,
    iconLibrary: iconConfig.iconLibrary,
    color: CategoryPillColors[index % CategoryPillColors.length],
  };
});

export function CategoryFilters({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onCategoryPress,
}: CategoryFiltersProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((category, index) => (
        <CategoryPill
          key={category.label}
          label={category.label}
          icon={category.icon}
          iconLibrary={category.iconLibrary}
          color={category.color}
          isSelected={selectedCategory === category.label}
          onPress={() => onCategoryPress?.(category.label)}
          isLast={index === categories.length - 1}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  pillContainer: {
    height: 42,
    borderRadius: 21,
    marginRight: Spacing.sm,
    overflow: "hidden",
  },
  pillContainerLast: {
    marginRight: 0,
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
