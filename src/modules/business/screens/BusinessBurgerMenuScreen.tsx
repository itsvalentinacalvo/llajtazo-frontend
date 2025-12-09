import React, { useEffect, useRef } from "react";
import { View, Dimensions, TouchableWithoutFeedback, StyleSheet, Text, Pressable, Image, ScrollView, ImageSourcePropType } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Typography, Spacing, Colors } from "@/src/core/constants/theme";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";

interface BusinessBurgerMenuProps {
  onAuthLogOut?: () => void;
  onSwitchToPersonal?: () => void;
}

export default function BusinessBurgerMenuScreen(props: BusinessBurgerMenuProps) {
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
      closing.value = 0;
      closeTimeoutRef.current = null;

      try {
        if (!skipGoBack) {
          const nav: any = navigation;
          if (typeof nav.canGoBack === "function") {
            const can = nav.canGoBack();
            if (can) {
              nav.goBack();
            }
          } else if (nav && nav.goBack) {
            nav.goBack();
          }
        }
      } catch (e) {
        console.warn("BusinessBurgerMenu close handleGoBack error:", e);
      }

      try {
        afterClose && afterClose();
      } catch (e) {
        console.warn("BusinessBurgerMenu afterClose callback error:", e);
      }
    }, 230);
  };

  function InlineDrawerContent({ navigation, onClose }: any) {
    const { theme } = useTheme();
    const { organizer, logoutBusiness } = useBusiness();

    const resolveAvatarSource = (avatar: any): ImageSourcePropType | undefined => {
      if (!avatar) return undefined;
      return typeof avatar === "string"
        ? { uri: avatar }
        : (avatar as ImageSourcePropType);
    };

    const avatarSource = resolveAvatarSource(organizer?.logo);
    const organizerName = organizer?.name || "Organizador";

    const isPlusSubscribed = organizer?.isPlus ?? false;

    const menuItems = [
      {
        icon: "bar-chart-2",
        iconType: "feather",
        label: "Metricas",
        route: "BusinessMetrics",
        isPlusFeature: true,
      },
      {
        icon: "credit-card",
        iconType: "feather",
        label: "Forma de Cobro",
        route: "BusinessPaymentMethods",
        isPlusFeature: true,
      },
      {
        icon: "mail",
        iconType: "feather",
        label: "Contáctanos",
        route: "BusinessContact",
        isPlusFeature: false,
      },
      {
        icon: "settings",
        iconType: "feather",
        label: "Configuración",
        route: "BusinessSettings",
        isPlusFeature: false,
      },
      {
        icon: "help-circle",
        iconType: "feather",
        label: "Soporte Business",
        route: "BusinessSupport",
        isPlusFeature: false,
      },
    ];

    const handleItemPress = (route?: string, customAction?: () => void) => {
      try {
        const executeAfterClose = () => {
          try {
            if (customAction) {
              customAction();
              return;
            }
            if (!route) return;
            if (navigation && typeof navigation.navigate === "function") {
              navigation.navigate("Business", { screen: route });
            }
          } catch (e) {
            console.warn("Navigation error from business drawer item after close:", e);
          }
        };

        if (onClose) {
          onClose(() => {
            executeAfterClose();
          });
        } else {
          executeAfterClose();
        }
      } catch (e) {
        console.warn("Error handling business drawer item press:", e);
      }
    };

    const handleLogout = () => {
      try {
        if (onClose) {
          onClose(() => {
            try {
              logoutBusiness();
              props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
            } catch (e) {
              console.warn("BusinessBurgerMenu: onAuthLogOut callback error:", e);
            }
          }, true);
        } else {
          try {
            logoutBusiness();
            props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
          } catch (e) {
            console.warn("BusinessBurgerMenu: onAuthLogOut callback error:", e);
          }
        }
      } catch (e) {
        console.warn("Error scheduling logout after close:", e);
        try {
          logoutBusiness();
          props && typeof props.onAuthLogOut === "function" && props.onAuthLogOut();
        } catch (ee) {
          console.warn("BusinessBurgerMenu: onAuthLogOut fallback error:", ee);
        }
      }
    };

    const handlePlusUpgrade = () => {
      if (onClose) {
        onClose(() => {
          console.log("Navigate to Llajtazo PLUS subscription");
        });
      }
    };

    return (
      <ScrollView 
        style={{ backgroundColor: theme.backgroundRoot }} 
        contentContainerStyle={{ paddingBottom: Spacing.xl, flexGrow: 1 }}
      >
        <View style={stylesInner.container}>
          <View style={stylesInner.profileSection}>
            {avatarSource ? (
              <Image source={avatarSource} style={stylesInner.profileImage} />
            ) : (
              <View style={[stylesInner.profileImage, stylesInner.profileImagePlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name="briefcase" size={28} color={theme.textSecondary} />
              </View>
            )}
            <Text style={[stylesInner.profileName, { color: theme.text }]}>{organizerName}</Text>
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
                <Feather name={item.icon as any} size={20} color={theme.textSecondary} />
                <Text style={[stylesInner.menuLabel, { color: theme.text }]}>{item.label}</Text>
                {item.isPlusFeature ? (
                  <View style={stylesInner.plusBadge}>
                    <MaterialCommunityIcons name="crown" size={14} color={Colors.light.primary} />
                  </View>
                ) : null}
              </Pressable>
            ))}

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                stylesInner.menuItem,
                pressed && { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="log-out" size={20} color={theme.textSecondary} />
              <Text style={[stylesInner.menuLabel, { color: theme.text }]}>Cerrar Sesión</Text>
            </Pressable>
          </View>

          {!isPlusSubscribed ? (
            <View style={stylesInner.proSection}>
              <Pressable style={stylesInner.proBadge} onPress={handlePlusUpgrade}>
                <MaterialCommunityIcons name="briefcase-outline" size={18} color="#FFFFFF" />
                <Text style={stylesInner.proText}>Llajtazo PLUS</Text>
              </Pressable>
            </View>
          ) : null}
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
  profileImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
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
    flex: 1,
  },
  plusBadge: {
    marginLeft: Spacing.xs,
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
