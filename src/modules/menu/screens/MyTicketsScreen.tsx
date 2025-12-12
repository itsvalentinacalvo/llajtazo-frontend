import React, { useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing } from "@/src/core/constants/theme";
import { MenuStackParamList } from "@/src/modules/menu/navigation/MenuNavigator";

import { AnimatedTabSwitch } from "@/src/modules/menu/components/AnimatedTabSwitch";
import { TicketCard } from "@/src/modules/menu/components/EventTicketCard";
import { useTickets } from "@/src/core/context/TicketsContext";

type Nav = NativeStackNavigationProp<MenuStackParamList, "Tickets">;

const ACTIVE_TICKETS = [
  {
    id: "1",
    title: "C.R.O en Concierto",
    venue: "Alice Park",
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
    ticketCount: 1,
  },
  {
    id: "2",
    title: "Fexco Negocios 2025",
    venue: "Radius Gallery - Santa Cruz, CA",
    image: require("@/src/modules/home/assets/fexco.jpg"),
    ticketCount: 3,
  },
  {
    id: "3",
    title: "El Circo - Capitulo Final",
    venue: "Alice Park",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
    ticketCount: 1,
  },
];

const USED_TICKETS = [
  {
    id: "4",
    title: "Reik en Concierto",
    venue: "Euphoria",
    image: require("@/src/modules/home/assets/reik.png"),
    ticketCount: 4,
  },
  {
    id: "5",
    title: "B-RLIN en Concierto",
    venue: "Euphoria",
    image: require("@/src/modules/home/assets/brlin.png"),
    ticketCount: 2,
  },
  {
    id: "6",
    title: "Pink Friday",
    venue: "Noma",
    image: require("@/src/modules/home/assets/pink-friday.png"),
    ticketCount: 1,
  },
];

const TABS = [
  { key: "active", label: "Activos" },
  { key: "used", label: "Usados" },
];

export default function MyTicketsScreen() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("active");

  const { groups } = useTickets();
  const tickets = activeTab === "active"
    ? groups.map((g) => ({
        id: g.eventId,
        title: g.title,
        venue: g.venue ?? "",
        image: g.image,
        ticketCount: g.tickets.length,
      }))
    : USED_TICKETS;

  const goToDetails = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    const ticketCount = ticket?.ticketCount ?? 1;
    navigation.navigate("TicketDetails", { ticketId: id, ticketCount });
  };

  const goBack = () => {
    // Always navigate to the Explore tab in the Home tabs
    try {
      (navigation as any).navigate("Home", { screen: "HomeTabs", params: { screen: "ExplorarTab" } });
    } catch (e) {
      navigation.goBack();
    }
  };

  const renderTicket = ({
    item,
  }: {
    item: (typeof ACTIVE_TICKETS)[0];
  }) => (
    <TicketCard
      id={item.id}
      title={item.title}
      venue={item.venue}
      image={item.image}
      ticketCount={item.ticketCount}
      onPress={() => goToDetails(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Pressable
          onPress={goBack}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText style={styles.headerTitle}>Tus Tickets</ThemedText>

        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.pressed,
          ]}
        >
          <Feather name="more-vertical" size={22} color={theme.text} />
        </Pressable>
      </View>

      <AnimatedTabSwitch
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "#120D26",
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
});
