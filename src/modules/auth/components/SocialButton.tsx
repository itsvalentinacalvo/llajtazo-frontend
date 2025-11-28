import { Pressable, Text, StyleSheet, Image } from "react-native";
import { Colors } from "@/src/core/constants/theme";

interface SocialButtonProps {
  title: string;
  onPress: () => void;
  type: "google" | "facebook";
}

export default function SocialButton({ title, onPress, type }: SocialButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Image
        source={
          type === "google"
            ? require("../assets/google-logo.png")
            : require("../assets/facebook-logo.png")
        }
        style={type === "google" ? styles.googleLogo : styles.facebookLogo}
        resizeMode="contain"
      />
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    maxWidth: 273,
    height: 56,
    backgroundColor: Colors.light.inputBackground,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#D3D4E2",
    shadowOffset: { width: 15, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 5,
    marginBottom: 16,
  },
  buttonPressed: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  googleLogo: {
    width: 26,
    height: 26,
  },
  facebookLogo: {
    width: 31,
    height: 31,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});
