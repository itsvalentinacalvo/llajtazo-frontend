import { Text, StyleSheet } from "react-native";
import { Colors } from "@/src/core/constants/theme";

export default function Divider() {
  return (
    <Text style={styles.divider}>O</Text>
  );
}

const styles = StyleSheet.create({
  divider: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
});
