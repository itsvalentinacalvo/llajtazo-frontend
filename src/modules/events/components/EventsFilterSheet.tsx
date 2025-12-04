import React from "react";
import { View, StyleSheet } from "react-native";

export const EventsFilterSheet = () => {
  return (
    <View style={styles.sheet}>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    minHeight: 200,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
});
