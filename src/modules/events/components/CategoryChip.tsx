import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const CategoryChip = () => {
  return (
    <View style={styles.chip}>
      <Text>Chip</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
});
