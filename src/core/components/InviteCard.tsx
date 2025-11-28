import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { useTheme } from "@/src/core/hooks/useTheme";

interface InviteCardProps {
  onPress?: () => void;
}

export function InviteCard({ onPress }: InviteCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: "#D4F1F9" }]}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Invita a tus Amigos</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Obtén 20 pts para tu próximo Ticket!
        </ThemedText>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.buttonText}>INVITAR</ThemedText>
        </Pressable>
      </View>
      <Image
        source={require("@/attached_assets/invite-hands-gift.png")}
        style={styles.illustration}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 127,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: Spacing.lg,
    paddingRight: 100,
    paddingVertical: Spacing.md,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BorderRadius.xs,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
  illustration: {
    width: 180,
    height: 160,
    position: "absolute",
    right: -30,
    bottom: -20,
  },
});
