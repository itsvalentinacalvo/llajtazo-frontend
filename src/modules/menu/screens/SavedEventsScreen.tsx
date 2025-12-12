import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList, Pressable, ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { CategoryFilters } from "@/src/core/components/CategoryFilters";
import { SavedEventCard } from "@/src/modules/menu/components/SavedEventCard";
import { SearchBar } from "@/src/core/components/SearchBar";
import { Spacing, Colors } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

type SavedEvent = {
  id: string;
  title: string;
  dateTime: string;
  image: ImageSourcePropType;
  backgroundColor?: string;
  category: string;
  isExpired?: boolean;
};

import { useSavedEvents } from "@/src/core/context/SavedEventsContext";

const normalizeLabel = (label: string) =>
  label.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function SavedEventsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | null>(null);
  const { getAll } = useSavedEvents();

  const SAVED_EVENTS = getAll();

  const filteredEvents = useMemo(
    () =>
      SAVED_EVENTS.filter((event) => {
        const title = event.title ?? "";
        const category = event.category ?? "";
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategoryLabel || normalizeLabel(category) === normalizeLabel(selectedCategoryLabel);
        return matchesSearch && matchesCategory;
      }),
    [selectedCategoryLabel, searchQuery, SAVED_EVENTS]
  );

  const handleCategoryPress = (label?: string) => {
    if (!label) {
      setSelectedCategoryLabel(null);
      return;
    }

    const normalizedLabel = normalizeLabel(label);
    const currentNormalized = selectedCategoryLabel ? normalizeLabel(selectedCategoryLabel) : null;
    if (currentNormalized === normalizedLabel) setSelectedCategoryLabel(null);
    else setSelectedCategoryLabel(label);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchWrapper}>
        <SearchBar
          placeholder="Buscar..."
          onSearchChange={setSearchQuery}
          onFilterPress={() => console.log("Filter pressed")}
          variant="light"
          accentColor={Colors.light.primary}
        />
      </View>

      <View style={styles.categoryContainer}>
        <CategoryFilters
          selectedCategory={selectedCategoryLabel || undefined}
          onCategoryPress={handleCategoryPress}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.titleBar, { paddingTop: insets.top, backgroundColor: theme.backgroundRoot }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>

        <ThemedText type="h4" style={styles.headerTitle} numberOfLines={1}>
          Guardados
        </ThemedText>

        <View style={styles.headerActions} />
      </View>

      <FlatList
        data={filteredEvents}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <SavedEventCard
              title={item.title ?? ""}
              subtitle={item.subtitle ?? undefined}
              dateTime={item.dateTime ?? ""}
              image={item.image}
              backgroundColor={item.backgroundColor ?? undefined}
              location={item.location ?? undefined}
              onPress={() => console.log("Event pressed:", item.title ?? "(no title)")}
              disabled={!!item.isExpired}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + Spacing.xl }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
    zIndex: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  headerActions: {
    width: 36,
    height: 36,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerContainer: {
    marginBottom: Spacing.md,
  },
  categoryContainer: {
    marginTop: Spacing.xs,
  },
  cardContainer: {
    paddingHorizontal: Spacing.xl,
  },
  listContent: {
    paddingTop: Spacing.md,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.xl,
  },
});
