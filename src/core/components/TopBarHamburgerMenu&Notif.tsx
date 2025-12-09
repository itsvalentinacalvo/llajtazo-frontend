import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Spacing } from "@/src/core/constants/theme";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";

interface TopBarProps {
  onNotificationPress?: () => void;
}

export function TopBar({ onNotificationPress }: TopBarProps) {
  const navigation = useNavigation();
  const { isBusinessAuthenticated } = useBusiness();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          console.debug("[Core][TopBar] openBurgerMenu, isBusinessAuthenticated:", isBusinessAuthenticated);
          try {
            if (isBusinessAuthenticated) {
              (navigation as any).navigate("BusinessBurgerMenu");
            } else {
              (navigation as any).navigate("BurgerMenu");
            }
          } catch (e) {
            console.debug("[Core][TopBar] navigation to BurgerMenu failed", e);
          }
        }}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Feather name="menu" size={24} color="#FFFFFF" />
      </Pressable>
      <Pressable
        onPress={() => {
          console.debug("[Core][TopBar] notifications pressed");
          onNotificationPress && onNotificationPress();
        }}
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
