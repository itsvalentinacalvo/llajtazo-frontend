import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/src/core/constants/theme";

export default function PaymentErrorScreen() {
  const { theme } = useTheme();

  // animations
  const containerOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 500 });

    iconScale.value = withSequence(
      withTiming(1.2, { duration: 500 }),
      withSpring(1)
    );

    textOpacity.value = withTiming(1, { duration: 600 });

    // after animations complete, go back to the previous screen (e.g., PaymentCard)
    const t = setTimeout(() => {
      try {
        navigation.goBack();
      } catch (e) {
        // fallback: if goBack fails, replace with Result to avoid leaving user stranded
        (navigation as any).replace("Result", { ticketId: "temp" });
      }
    }, 1400);

    return () => clearTimeout(t);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const navigation = useNavigation();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: Colors.light.error ?? "#FF4D4D" },
        containerStyle,
      ]}
    >
      {/* ICON */}
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <MaterialCommunityIcons
          name="credit-card-remove"
          size={140}
          color={"white"}
        />
      </Animated.View>

      {/* TEXT */}
      <Animated.View style={textStyle}>
        <ThemedText style={styles.title}>Intenta de nuevo</ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
});
