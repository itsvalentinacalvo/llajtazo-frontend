import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/src/core/constants/theme";

const { height } = Dimensions.get("window");

export interface ShareItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

interface ShareTabProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  shareItems?: ShareItem[];
}

export const ShareTab: React.FC<ShareTabProps> = ({
  visible,
  onClose,
  title = "Comparte con amigos",
  shareItems,
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, slideAnim]);

  // --------------------------------------------
  //  ICONOS FINALES (ampliados para mejor legibilidad)
  // --------------------------------------------
  const defaultItems: ShareItem[] = [
    // COPY LINK
    {
      id: "copy",
      label: "Copiar Link",
      icon: (
        <View style={styles.iconWrapper40}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: theme.backgroundTertiary },
            ]}
          >
            <MaterialIcons
              name="content-copy"
              size={36}
              color={theme.textSecondary}
            />
          </View>
        </View>
      ),
      onPress: () => {
        console.log("Copy link");
        onClose();
      },
    },

    // WHATSAPP
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: (
        <LinearGradient
          colors={["#5BD066", "#27B43E"]}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconBox, styles.iconShadowGreen]}
        >
          <FontAwesome name="whatsapp" size={40} color="#FFF" />
        </LinearGradient>
      ),
      onPress: () => {
        console.log("Share on WhatsApp");
        onClose();
      },
    },

    // FACEBOOK
    {
      id: "facebook",
      label: "Facebook",
      icon: (
        <LinearGradient
          colors={["#18ACFE", "#0163E0"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.iconBox, styles.iconShadowBlue]}
        >
          <FontAwesome name="facebook" size={36} color="#FFF" />
        </LinearGradient>
      ),
      onPress: () => {
        console.log("Share on Facebook");
        onClose();
      },
    },

    // MESSENGER
    {
      id: "messenger",
      label: "Messenger",
      icon: (
        <LinearGradient
          colors={["#FD607A", "#913BFF", "#1A7BFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconBox, styles.iconShadowPurple]}
        >
          <FontAwesome5 name="facebook-messenger" size={36} color="#FFF" />
        </LinearGradient>
      ),
      onPress: () => {
        console.log("Share on Messenger");
        onClose();
      },
    },

    // X (TWITTER)
    {
      id: "x",
      label: "X",
      icon: (
        <View style={[styles.iconBox, styles.iconBlack]}>
          <FontAwesome6 name="x-twitter" size={36} color="#FFF" />
        </View>
      ),
      onPress: () => {
        console.log("Share on X");
        onClose();
      },
    },

    // INSTAGRAM
    {
      id: "instagram",
      label: "Instagram",
      icon: (
        <LinearGradient
          colors={["#FEDA75", "#FA7E1E", "#D62976", "#962FBF", "#4F5BD5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.iconBox, styles.iconShadowPink]}
        >
          <Ionicons name="logo-instagram" size={40} color="#FFF" />
        </LinearGradient>
      ),
      onPress: () => {
        console.log("Share on Instagram");
        onClose();
      },
    },

    // TIKTOK
    {
      id: "tiktok",
      label: "TikTok",
      icon: (
        <View
          style={[styles.iconBox, styles.iconBlack, styles.iconShadowBlueLight]}
        >
          <FontAwesome5 name="tiktok" size={34} color="#FFF" />
        </View>
      ),
      onPress: () => {
        console.log("Share on TikTok");
        onClose();
      },
    },

    // MESSAGES
    {
      id: "messages",
      label: "Messages",
      icon: (
        <LinearGradient
          colors={["#5AF575", "#13BD2C"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.iconBox, styles.iconShadowGreenLight]}
        >
          <Feather name="message-circle" size={40} color="#FFF" />
        </LinearGradient>
      ),
      onPress: () => {
        console.log("Share via Messages");
        onClose();
      },
    },
  ];

  const items = shareItems || defaultItems;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} accessible={false} />

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: theme.white,
          },
        ]}
      >
        <View style={styles.handle} />
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

        <View style={styles.grid}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

// ------------------------------------------------
//                 STYLES
// ------------------------------------------------
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    maxHeight: height * 0.7,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.backgroundTertiary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },

  title: {
    ...Typography.h2,
    marginBottom: Spacing.xl + 5,
    textAlign: "center",
  },

  // ---------- GRID PERFECTO (4 COLUMNAS) ----------
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  item: {
    width: "22%", // Perfecto para 4 columnas
    alignItems: "center",
    marginBottom: 22,
  },

  itemPressed: {
    opacity: 0.7,
  },

  // ----------- ICONOS 40x40 FINALES -----------
  iconWrapper40: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBlack: {
    backgroundColor: "#000",
  },

  // ----------- SOMBRAS SEGÚN FIGMA -----------
  iconShadowGreen: {
    shadowColor: "#3DC04F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconShadowGreenLight: {
    shadowColor: "#1DC536",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconShadowBlue: {
    shadowColor: "#0672E7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconShadowBlueLight: {
    shadowColor: "#1D7FD8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconShadowPurple: {
    shadowColor: "#7B48FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  iconShadowPink: {
    shadowColor: "#E1425D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  label: {
    ...Typography.caption,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
});
