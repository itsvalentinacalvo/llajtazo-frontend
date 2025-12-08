import React, { useEffect } from "react";
import { StyleSheet, ScrollView, Pressable, View, ImageSourcePropType, useWindowDimensions } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, Shadows, CategoryPillColors, Colors } from "@/src/core/constants/theme";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function CategoryPill({
  label,
  icon,
  iconLibrary,
  color,
  isSelected,
  isLast,
  onPress,
}: CategoryPillProps) {
  const { width: screenWidth } = useWindowDimensions();
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const isSmallScreen = screenWidth < 350;
  const pillHeight = isSmallScreen ? 36 : 42;
  const iconSize = isSmallScreen ? 16 : 20;
  const fontSize = isSmallScreen ? 13 : 15;
  const horizontalPadding = isSmallScreen ? 14 : 20;

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.05, { damping: 15, stiffness: 200 });
      borderOpacity.value = withTiming(1, { duration: 200 });
      glowOpacity.value = withTiming(0.4, { duration: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      borderOpacity.value = withTiming(0, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isSelected, scale, borderOpacity, glowOpacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBorderStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        styles.pillContainer,
        Shadows.categoryPill,
        { height: pillHeight, borderRadius: pillHeight / 2 },
        isLast && styles.pillContainerLast,
        animatedContainerStyle,
      ]}
    >
      <Animated.View 
        style={[
          styles.selectedGlow, 
          { 
            backgroundColor: color,
            borderRadius: pillHeight / 2,
          },
          animatedGlowStyle,
        ]} 
      />
      
      <View style={[styles.pillContent, { backgroundColor: color, paddingHorizontal: horizontalPadding }]}>
        <View style={styles.pillIcon}>
          <CategoryIcon icon={icon} iconLibrary={iconLibrary} size={iconSize} color="#FFFFFF" />
        </View>
        <ThemedText style={[styles.pillLabel, { fontSize }]}>{label}</ThemedText>
      </View>
      
      <Animated.View 
        style={[
          styles.selectedBorder, 
          { 
            borderColor: Colors.light.white,
            borderRadius: pillHeight / 2,
          },
          animatedBorderStyle,
        ]} 
      />
    </AnimatedPressable>
  );
}

interface CategoryFiltersProps {
  categories?: Category[];
  selectedCategory?: string;
  onCategoryPress?: (label: string | undefined) => void;
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
  const handlePress = (label: string) => {
    if (selectedCategory === label) {
      onCategoryPress?.(undefined);
    } else {
      onCategoryPress?.(label);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      {categories.map((category, index) => (
        <CategoryPill
          key={category.label}
          label={category.label}
          icon={category.icon}
          iconLibrary={category.iconLibrary}
          color={category.color}
          isSelected={selectedCategory === category.label}
          onPress={() => handlePress(category.label)}
          isLast={index === categories.length - 1}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    overflow: "visible",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 8,
  },
  pillContainer: {
    marginRight: Spacing.sm,
    overflow: "visible",
    position: "relative",
  },
  pillContainerLast: {
    marginRight: 0,
  },
  pillContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    height: "100%",
    borderRadius: 21,
  },
  pillIcon: {
    marginRight: 8,
  },
  pillLabel: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectedBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderWidth: 2.5,
  },
  selectedGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
  },
});
