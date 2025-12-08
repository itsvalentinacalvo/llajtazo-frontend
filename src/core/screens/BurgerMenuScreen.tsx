import React, { useEffect, useRef } from "react";
import { View, Dimensions, TouchableWithoutFeedback, StyleSheet, Text, Pressable, Image, ScrollView, ImageSourcePropType } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Typography, Spacing } from "@/src/core/constants/theme";
import { BURGER_MENU_PROFILE } from "@/src/core/test/profileData";
import { useProfile } from "@/src/core/context/ProfileContext";

export default function BurgerMenuScreen(props: any) {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const drawerWidth = Math.min(340, screenWidth * 0.55);

  const translateX = useSharedValue(-drawerWidth);
  const closing = useSharedValue(0);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 320 });

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const close = (afterClose?: () => void, skipGoBack: boolean = false) => {
    if (closing.value === 1) return;
    closing.value = 1;

    translateX.value = withTiming(-drawerWidth, { duration: 220 });

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      console.debug("BurgerMenu close timeout fired", { skipGoBack });
      closing.value = 0;
      closeTimeoutRef.current = null;

      try {
        if (!skipGoBack) {
          const nav: any = navigation;
          if (typeof nav.canGoBack === "function") {
            const can = nav.canGoBack();
            console.debug("BurgerMenu close: nav.canGoBack() =>", can);
            if (can) {
              nav.goBack();
            }
          } else if (nav && nav.goBack) {
            nav.goBack();
          }
        } else {
          console.debug("BurgerMenu close: skipGoBack true, not calling navigation.goBack");
        }
      } catch (e) {
        console.warn("BurgerMenu close handleGoBack error (timeout):", e);
      }

      try {
        afterClose && afterClose();
      } catch (e) {
        console.warn("BurgerMenu afterClose callback error (timeout):", e);
      }
    }, 230);
  };

  function InlineDrawerContent({ navigation, onClose }: any) {
    const { theme } = useTheme();
    const { profile } = useProfile();

    const resolveAvatarSource = (avatar: any): ImageSourcePropType | undefined => {
      if (!avatar) return undefined;
      return typeof avatar === "string"
        ? { uri: avatar }
        : (avatar as ImageSourcePropType);
    };

    const avatarSource = resolveAvatarSource(profile.avatar) ?? BURGER_MENU_PROFILE.avatar;

    const menuItems = [
      { icon: "ticket-outline", iconType: "ionicons", label: "Tus Tickets", route: "Tickets" },
      { icon: "calendar", iconType: "feather", label: "Calendario", route: "Calendar" },
      { icon: "bookmark", iconType: "feather", label: "Guardados", route: "Saved" },
      { icon: "settings", iconType: "feather", label: "Configuración", route: "Settings" },
      { icon: "help-circle", iconType: "feather", label: "Contáctanos", route: "Contact" },
    ];

    const handleItemPress = (route?: string) => {
      try {
        const navigateToRoute = () => {
          try {
            if (!route) return;
            // Many app screens live under the Home navigator; route names here
            // should target screens inside Home. Navigate into the Home stack
            // so nested screens like "Tickets" resolve correctly.
            if (navigation && typeof navigation.navigate === "function") {
              navigation.navigate("Home", { screen: route });
            }
          } catch (e) {
            console.warn("Navigation error from drawer item after close:", e);
          }
        };

        if (onClose) {
          onClose(() => {
            navigateToRoute();
          });
        } else {
          navigateToRoute();
        }
      } catch (e) {
        console.warn("Error handling drawer item press:", e);
      }
    };

    const handleLogout = () => {
      console.log("Cerrar Sesión pressed -> calling onAuthLogOut prop");
      try {
        if (onClose) {
          onClose(() => {
            try {
              props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
            } catch (e) {
              console.warn("BurgerMenu: onAuthLogOut callback error:", e);
            }
          }, true);
        } else {
          try {
            props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
          } catch (e) {
            console.warn("BurgerMenu: onAuthLogOut callback error:", e);
          }
        }
      } catch (e) {
        console.warn("Error scheduling logout after close:", e);
        try {
          props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
        } catch (ee) {
          console.warn("BurgerMenu: onAuthLogOut fallback error:", ee);
        }
      }
    };

    return (
      <ScrollView style={{ backgroundColor: theme.backgroundRoot }} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        <View style={stylesInner.container}>
          <View style={stylesInner.profileSection}>
            <Image source={avatarSource} style={stylesInner.profileImage} />
            <Text style={[stylesInner.profileName, { color: theme.text }]}>{profile.name}</Text>
            <Text style={[stylesInner.profileEmail, { color: theme.textSecondary }]}>{profile.email}</Text>
          </View>

          <View style={stylesInner.menuSection}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleItemPress(item.route)}
                style={({ pressed }) => [
                  stylesInner.menuItem,
                  pressed && { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                {item.iconType === "ionicons" ? (
                  <Ionicons name={item.icon as any} size={20} color={theme.textSecondary} />
                ) : (
                  <Feather name={item.icon as any} size={20} color={theme.textSecondary} />
                )}

                <Text style={[stylesInner.menuLabel, { color: theme.text }]}>{item.label}</Text>
              </Pressable>
            ))}

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                stylesInner.menuItem,
                pressed && { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="log-out" size={20} color={useTheme().theme.textSecondary} />
              <Text style={[stylesInner.menuLabel, { color: useTheme().theme.text }]}>Cerrar Sesión</Text>
            </Pressable>
          </View>

          <View style={stylesInner.proSection}>
            <Pressable style={stylesInner.proBadge} onPress={() => { onClose && onClose(); console.log("Vuelvete PRO"); }}>
              <Feather name="star" size={16} color="#FFFFFF" />
              <Text style={stylesInner.proText}>Vuelvete PRO</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => close()}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.drawer, { width: drawerWidth }, animatedStyle]}>
        <InlineDrawerContent navigation={navigation} onClose={close} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 8,
    paddingVertical: 12,
  },
});

const stylesInner = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  profileSection: {
    alignItems: "flex-start",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xl + 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: Spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  menuSection: {
    paddingTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  menuLabel: {
    fontSize: Typography.body.fontSize,
    marginLeft: Spacing.md,
  },
  proSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    marginTop: "auto",
    paddingBottom: Spacing.xl,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2BBBFF",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  proText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: Spacing.xs,
  },
});
