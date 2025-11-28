import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Spacing } from "@/src/core/constants/theme";

interface TopBarProps {
  onNotificationPress?: () => void;
}

export function TopBar({ onNotificationPress }: TopBarProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.openDrawer()}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Feather name="menu" size={24} color="#FFFFFF" />
      </Pressable>
      <Pressable
        onPress={onNotificationPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Feather name="bell" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
});
