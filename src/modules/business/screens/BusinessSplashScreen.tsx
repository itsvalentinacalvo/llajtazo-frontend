import { useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Colors } from "@/src/core/constants/theme";

interface BusinessSplashScreenProps {
  onComplete: () => void;
  minimumDuration?: number;
}

export default function BusinessSplashScreen({
  onComplete,
  minimumDuration = 2500,
}: BusinessSplashScreenProps) {
  const circleScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    circleScale.value = withSequence(
      withTiming(50, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      withTiming(50, { duration: 200 })
    );

    setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 400 });
    }, 600);

    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 400 });
    }, 900);

    const exitTimer = setTimeout(() => {
      runOnJS(handleComplete)();
    }, minimumDuration);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [circleScale, logoOpacity, textOpacity, handleComplete, minimumDuration]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, circleStyle]} />
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("@/src/core/assets/icon/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <ThemedText style={styles.businessText}>Business Partner</ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.white,
  },
  logoContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    tintColor: Colors.light.white,
  },
  textContainer: {
    position: "absolute",
    bottom: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  businessText: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.light.white,
    letterSpacing: 0.5,
  },
});
