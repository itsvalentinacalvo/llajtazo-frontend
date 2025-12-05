import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Spacing } from "@/src/core/constants/theme";

interface TopBarProps {
  onNotificationPress?: () => void;
}

export function TopBar({ onNotificationPress }: TopBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          console.debug("[Core][TopBar] openBurgerMenu");
          // antes abríamos el Drawer; ahora navegamos a la pantalla BurgerMenu registrada en Root
          try {
            (navigation as any).navigate("BurgerMenu");
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
