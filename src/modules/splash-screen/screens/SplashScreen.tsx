import { useEffect, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import * as SplashScreenModule from "expo-splash-screen";
import { Asset } from "expo-asset";
import { Colors } from "@/src/core/constants/theme";

SplashScreenModule.preventAutoHideAsync();

interface SplashScreenProps {
  onReady: () => void;
  minimumDuration?: number;
}

const eventImages = [
  require("@/src/modules/home/assets/cro-concierto.jpg"),
  require("@/src/modules/home/assets/modo-cumbia.png"),
  require("@/src/modules/home/assets/oktober-fest.png"),
  require("@/src/modules/home/assets/pink-friday.png"),
  require("@/src/modules/home/assets/levitar.png"),
];

const coreAssets = [
  require("@/src/core/assets/icon/logo.png"),
  require("@/src/core/assets/icon/icon.png"),
  require("@/src/core/assets/sombrero-cholita.png"),
  require("@/src/core/assets/google-logo (copy).png"),
  require("@/src/core/assets/invite-hands-gift.png"),
];

const authAssets = [
  require("@/src/modules/auth/assets/google-logo.png"),
  require("@/src/modules/auth/assets/facebook-logo.png"),
];

export default function SplashScreen({ onReady, minimumDuration = 3100 }: SplashScreenProps) {
  const circleScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const exitProgress = useSharedValue(0);
  const [isExiting, setIsExiting] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const preloadAssets = useCallback(async () => {
    try {
      const allAssets = [...eventImages, ...coreAssets, ...authAssets];
      const imageAssets = allAssets.map((image) => {
        if (typeof image === "string") {
          return Image.prefetch(image);
        }
        return Asset.fromModule(image).downloadAsync();
      });

      await Promise.all(imageAssets);
      await SplashScreenModule.hideAsync();
      setAssetsLoaded(true);
    } catch (e) {
      console.error("[SplashScreen] preloadAssets error", e);
      await SplashScreenModule.hideAsync();
      setAssetsLoaded(true);
    }
  }, []);

  const handleAnimationComplete = useCallback(() => {
    onReady();
  }, [onReady]);

  const startExitAnimation = useCallback(() => {
    setIsExiting(true);
    exitProgress.value = withTiming(1, {
      duration: 400,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }, (finished) => {
      if (finished) {
        runOnJS(handleAnimationComplete)();
      }
    });
  }, [exitProgress, handleAnimationComplete]);

  useEffect(() => {
    preloadAssets();

    circleScale.value = withSequence(
      withTiming(50, {
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      withTiming(50, { duration: 200 })
    );

    setTimeout(() => {
      logoOpacity.value = withTiming(1, { duration: 500 });
    }, 800);

    const exitTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, minimumDuration);

    return () => {
      clearTimeout(exitTimer);
    };
  }, [circleScale, logoOpacity, preloadAssets, minimumDuration]);

  useEffect(() => {
    if (assetsLoaded && animationComplete && !isExiting) {
      runOnJS(startExitAnimation)();
    }
  }, [assetsLoaded, animationComplete, isExiting, startExitAnimation]);

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  const containerExitStyle = useAnimatedStyle(() => {
    const opacity = interpolate(exitProgress.value, [0, 1], [1, 0]);
    const scale = interpolate(exitProgress.value, [0, 1], [1, 1.05]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, isExiting && containerExitStyle]}>
      <Animated.View style={[styles.circle, circleStyle]} />
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("@/src/core/assets/icon/logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
  },
  logoContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
