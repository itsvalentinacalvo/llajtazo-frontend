import React from "react";
import { View, StyleSheet } from "react-native";

export const EventCard = () => {
  return <View style={styles.card} />;
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#eee",
  },
});
