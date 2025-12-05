import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "@/src/core/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/src/core/constants/theme";

const { height } = Dimensions.get("window");

export interface AccountProfile {
  id: string;
  name: string;
  // avatar can be a remote URI (string) or a local require() (number)
  avatar: ImageSourcePropType | string | null;
  isSelected: boolean;
}

interface LinkedOrganizerInfo {
  id: number;
  name: string;
  about: string;
  followers: number;
  subscribed: boolean;
  logo: ImageSourcePropType;
}

interface SwitchAccountTabProps {
  visible: boolean;
  onClose: () => void;
  accounts: AccountProfile[];
  onSelectAccount: (accountId: string) => void;
  onOrganizeEvent?: () => void;
  linkedOrganizer?: LinkedOrganizerInfo;
  showOrganizeEventCta?: boolean;
}

export const SwitchAccountTab: React.FC<SwitchAccountTabProps> = ({
  visible,
  onClose,
  accounts,
  onSelectAccount,
  onOrganizeEvent,
  linkedOrganizer,
  showOrganizeEventCta = false,
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

  const handleSelectAccount = (accountId: string) => {
    onSelectAccount(accountId);
    onClose();
  };

  const handleOrganizeEvent = () => {
    if (onOrganizeEvent) {
      onOrganizeEvent();
    }
    onClose();
  };

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

        <Text style={[styles.title, { color: theme.text }]}>
          Cambiar de cuenta
        </Text>

        <View style={styles.accountsList}>
          {accounts.map((account) => (
            <Pressable
              key={account.id}
              style={({ pressed }) => [
                styles.accountRow,
                pressed && styles.accountRowPressed,
              ]}
              onPress={() => handleSelectAccount(account.id)}
            >
              <View style={styles.avatarContainer}>
                {account.avatar ? (
                  <Image
                    source={typeof account.avatar === 'string' ? { uri: account.avatar } : account.avatar as any}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Feather name="user" size={36} color={theme.textSecondary} />
                  </View>
                )}
              </View>

              <Text style={[styles.accountName, { color: theme.text }]}> 
                {account.name}
              </Text>

              {account.isSelected ? (
                <View style={styles.checkmarkContainer}>
                  <Feather name="check" size={28} color={Colors.light.primary} />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {linkedOrganizer ? (
          <View
            style={[styles.organizerSection, { backgroundColor: theme.backgroundSecondary }]}
          >
            <View style={styles.organizerHeader}>
              <Image source={linkedOrganizer.logo} style={styles.organizerLogo} />
              <View style={styles.organizerDetails}>
                <Text style={[styles.organizerName, { color: theme.text }]}>
                  {linkedOrganizer.name}
                </Text>
                <Text
                  style={[styles.organizerAbout, { color: theme.textSecondary }]}
                  numberOfLines={2}
                >
                  {linkedOrganizer.about}
                </Text>
              </View>
            </View>
            <View style={styles.organizerMetaRow}>
              <Feather name="users" size={18} color={theme.textSecondary} />
              <Text style={[styles.organizerMetaText, { color: theme.textSecondary }]}>
                {linkedOrganizer.followers.toLocaleString("es-BO")} seguidores
              </Text>
              {linkedOrganizer.subscribed ? (
                <>
                  <View style={[styles.organizerDot, { backgroundColor: Colors.light.primary }]} />
                  <Text style={[styles.organizerMetaText, { color: Colors.light.primary }]}>
                    Cuenta vinculada
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        ) : showOrganizeEventCta ? (
          <Pressable
            style={({ pressed }) => [
              styles.organizeEventRow,
              pressed && styles.accountRowPressed,
            ]}
            onPress={handleOrganizeEvent}
          >
            <View style={styles.organizeIconContainer}>
              <MaterialCommunityIcons
                name="party-popper"
                size={36}
                color={theme.textSecondary}
              />
            </View>
            <Text style={[styles.organizeText, { color: theme.text }]}> 
              Organiza tu Evento
            </Text>
          </Pressable>
        ) : null}
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
    textAlign: "center",
    marginBottom: Spacing.xl,
  },

  accountsList: {
    marginBottom: 0,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },

  accountRowPressed: {
    opacity: 0.7,
  },

  avatarContainer: {
    marginRight: Spacing.lg,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  avatarPlaceholder: {
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  accountName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },

  checkmarkContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  organizeEventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
  },

  organizeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },

  organizeText: {
    fontSize: 17,
    fontWeight: "600",
  },
  organizerSection: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  organizerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  organizerLogo: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.lg,
  },
  organizerDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
  organizerName: {
    fontSize: 18,
    fontWeight: "700",
  },
  organizerAbout: {
    fontSize: 14,
    lineHeight: 18,
  },
  organizerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  organizerMetaText: {
    fontSize: 14,
    fontWeight: "600",
  },
  organizerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
