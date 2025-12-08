import React, { useState } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { CategoryFilters } from "@/src/core/components/CategoryFilters";
import { SavedEventCard } from "@/src/modules/menu/components/SavedEventCard";
import { SearchBar } from "@/src/core/components/SearchBar";
import { Spacing, Colors } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

const SAVED_EVENTS = [
  {
    id: "1",
    title: "C.R.O en Concierto",
    dateTime: "11 DE ABRIL - VIE - 9:00 PM",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
    backgroundColor: "#FFFFFF",
    category: "musica",
  },
  {
    id: "2",
    title: "Fico's Show - Barbie sin ley, aqui viene Milei",
    dateTime: "8 DE SEPTIEMBRE - DOM - 7:00 PM",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
    backgroundColor: "#FFFFFF",
    category: "cultura",
  },
  {
    id: "3",
    title: "Obra Teatral - Genialmente Malas",
    dateTime: "9 DE FEBRERO - JUE - 6:00 PM",
    image: require("@/src/modules/home/assets/levitar.png"),
    backgroundColor: "#E6E6E8",
    category: "cultura",
  },
  {
    id: "4",
    title: "Cocha Emprende - Septiembre",
    dateTime: "13 Y 14 DE ENERO - 9:00 AM",
    image: require("@/src/modules/home/assets/fexco.jpg"),
    backgroundColor: "rgba(151, 151, 151, 0.16)",
    category: "ferias",
  },
];

export default function SavedEventsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEvents = SAVED_EVENTS.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (label: string) => {
    const normalizedLabel = label.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (selectedCategory === normalizedLabel) setSelectedCategory(null);
    else setSelectedCategory(normalizedLabel);
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
        <CategoryFilters selectedCategory={selectedCategory || undefined} onCategoryPress={handleCategoryPress} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.titleBar, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Feather name="arrow-left" size={22} color="#120D26" />
        </Pressable>

        <ThemedText style={styles.title}>Guardados</ThemedText>

        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={filteredEvents}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item, index }) => {
          const isDisabled = index >= Math.max(0, filteredEvents.length - 2);
          return (
            <View style={styles.cardContainer}>
              <SavedEventCard
                title={item.title}
                dateTime={item.dateTime}
                image={item.image}
                backgroundColor={item.backgroundColor}
                onPress={() => console.log("Event pressed:", item.title)}
                disabled={isDisabled}
              />
            </View>
          );
        }}
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
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#120D26",
  },
  placeholder: {
    width: 36,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  categoryContainer: {
    marginTop: Spacing.lg,
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
