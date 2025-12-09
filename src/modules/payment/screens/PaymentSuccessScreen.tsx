import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from "react-native-reanimated";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentSuccessScreen() {
  const { theme } = useTheme();

  const route = useRoute<any>();

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

    // after animations complete, navigate to Result screen forwarding params
    const timer = setTimeout(() => {
      const params = route?.params ?? {};
      (navigation as any).replace("Result", {
        ...params,
        // ensure ticketId exists
        ticketId: params?.ticketId ?? "temp",
      });
    }, 1400);

    return () => clearTimeout(timer);
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
        { backgroundColor: theme.primary },
        containerStyle,
      ]}
    >
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <MaterialCommunityIcons name="credit-card-check" size={140} color={theme.white} />
      </Animated.View>

      <Animated.View style={textStyle}>
        <ThemedText style={styles.title}>Pago Exitoso!</ThemedText>
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

  cardIconBackground: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
 

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
});
