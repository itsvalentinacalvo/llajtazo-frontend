import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/src/core/components/ScreenScrollView";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing } from "@/src/core/constants/theme";
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BusinessEventCard } from "@/src/modules/business/components/BusinessEventCard";
import { BusinessEvent } from "@/src/modules/business/test/businessData";
import { BusinessStackParamList } from "@/src/modules/business/navigation/BusinessNavigator";

type NavigationProp = NativeStackNavigationProp<BusinessStackParamList>;

export default function InicioBusinessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { events } = useBusiness();
  const { headerHeight } = useHomeHeader();

  const activeEvents = events.filter((event) => event.status === "active");

  const renderEventCard = ({ item }: { item: BusinessEvent }) => (
    <BusinessEventCard
      title={item.title}
      date={item.date}
      time={item.time}
      location={item.location}
      image={item.image}
      totalSales={item.totalSales}
      ticketsSold={item.ticketsSold}
      onPress={() => navigation.navigate("PreviewEvent", { eventId: item.id })}
    />
  );

  return (
    <ScreenScrollView
      contentHorizontalPadding={0}
      contentContainerStyle={[
        styles.container,
        { paddingTop: headerHeight + Spacing.sm },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Mis Eventos Activos</ThemedText>
          <ThemedText style={styles.subtitle}>
            {activeEvents.length}{" "}
            {activeEvents.length === 1 ? "evento activo" : "eventos activos"}
          </ThemedText>
        </View>

        <FlatList
          data={activeEvents}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No tienes eventos activos
              </ThemedText>
            </View>
          }
        />
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: Spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
    textAlign: "center",
  },
});
