import React from "react";
import { StyleSheet, ScrollView, Pressable, View, ImageSourcePropType } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, Shadows, CategoryPillColors } from "@/src/core/constants/theme";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";

type IconLibrary = "feather" | "material" | "ionicons" | "fontawesome" | "image";

type CategoryConfig = {
  icon: string | ImageSourcePropType;
  iconLibrary: IconLibrary;
  color?: string;
};

const DEFAULT_CATEGORY_CONFIG: CategoryConfig = {
  icon: "tag",
  iconLibrary: "feather",
};

const CATEGORY_CONFIG_MAP: Record<string, CategoryConfig> = {
  cultura: {
    color: "#FF6B6B",
    icon: require("@/src/core/assets/sombrero-cholita.png"),
    iconLibrary: "image",
  },
  musica: {
    color: "#FFA85C",
    icon: "music",
    iconLibrary: "material",
  },
  ferias: {
    color: "#5DD9A4",
    icon: "bag",
    iconLibrary: "ionicons",
  },
  arte: {
    color: "#9B59B6",
    icon: "paint-brush",
    iconLibrary: "fontawesome",
  },
  danza: {
    icon: "shoe-ballet",
    iconLibrary: "material",
  },
};

function getCategoryConfig(label: string, index: number) {
  const normalizedLabel = label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const config = CATEGORY_CONFIG_MAP[normalizedLabel] ?? DEFAULT_CATEGORY_CONFIG;
  const color = config.color ?? CategoryPillColors[index % CategoryPillColors.length];

  return {
    icon: config.icon,
    iconLibrary: config.iconLibrary,
    color,
  };
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
  const { icon, iconLibrary, color } = getCategoryConfig(category.nombre, index);
  return {
    id: category.id,
    label: category.nombre,
    icon,
    iconLibrary,
    color,
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
