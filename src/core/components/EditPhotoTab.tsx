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
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useTheme } from "@/src/core/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography } from "@/src/core/constants/theme";

const { height } = Dimensions.get("window");

interface EditPhotoTabProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickPhoto: () => void;
}

export const EditPhotoTab: React.FC<EditPhotoTabProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onPickPhoto,
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
  }, [visible]);

  const handleTakePhoto = () => {
    onTakePhoto();
    onClose();
  };

  const handlePickPhoto = () => {
    onPickPhoto();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose} />

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: theme.white,
          },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Options */}
        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            pressed && styles.rowPressed,
          ]}
          onPress={handleTakePhoto}
        >
          <View style={styles.iconBox}>
            <Entypo name="camera" size={30} color={theme.textSecondary} />
          </View>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Tomar foto
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.optionRow,
            pressed && styles.rowPressed,
          ]}
          onPress={handlePickPhoto}
        >
          <View style={styles.iconBox}>
            <MaterialIcons name="photo" size={32} color={theme.textSecondary} />
          </View>
          <Text style={[styles.optionText, { color: theme.text }]}>
            Escoger foto
          </Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

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
    paddingBottom: Spacing.xl + 10,
    paddingHorizontal: Spacing.xl,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.backgroundTertiary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },

  rowPressed: {
    opacity: 0.7,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },

  optionText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
