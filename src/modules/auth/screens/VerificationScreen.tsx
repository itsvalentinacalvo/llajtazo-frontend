import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/src/core/components/ThemedText";

export default function EventosScreen() {
  return (
    <View style={styles.container}>
      <ThemedText>Verification Screen</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
