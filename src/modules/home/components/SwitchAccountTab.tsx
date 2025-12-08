import React, { useRef, useEffect, useState } from "react";
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
  isSelected?: boolean;
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
  onOrganizeEvent: _onOrganizeEvent,
  linkedOrganizer,
  showOrganizeEventCta = false,
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const derivedSelectedKey = (() => {
    const selectedAccount = accounts.find((account) => account.isSelected);
    if (selectedAccount) {
      return `account-${selectedAccount.id}`;
    }

    if (linkedOrganizer?.isSelected) {
      return `organizer-${linkedOrganizer.id}`;
    }

    return null;
  })();
  const derivedSelectedKeyRef = useRef(derivedSelectedKey);
  const [selectedAccountKey, setSelectedAccountKey] = useState<string | null>(derivedSelectedKey);

  useEffect(() => {
    if (derivedSelectedKey !== derivedSelectedKeyRef.current) {
      derivedSelectedKeyRef.current = derivedSelectedKey;
      setSelectedAccountKey(derivedSelectedKey);
    }
  }, [derivedSelectedKey]);

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

  const handleSelectAccount = (accountId: string, source: "account" | "organizer") => {
    setSelectedAccountKey(`${source}-${accountId}`);
    onSelectAccount(accountId);
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
              onPress={() => handleSelectAccount(account.id, "account")}
              style={({ pressed }) => [
                styles.accountRow,
                {
                  backgroundColor: selectedAccountKey === `account-${account.id}`
                    ? theme.white
                    : theme.backgroundSecondary,
                  borderColor: selectedAccountKey === `account-${account.id}`
                    ? Colors.light.primary
                    : Colors.light.backgroundSecondary,
                },
                pressed && styles.accountRowPressed,
              ]}
            >
              <View style={styles.accountContent}>
                <View style={styles.avatarWrapper}>
                  {account.avatar ? (
                    <Image
                      source={
                        typeof account.avatar === "string"
                          ? { uri: account.avatar }
                          : (account.avatar as any)
                      }
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Feather name="user" size={36} color={theme.textSecondary} />
                    </View>
                  )}
                </View>

                <Text style={[styles.accountName, { color: theme.text }]} numberOfLines={2}>
                  {account.name}
                </Text>
              </View>
              {selectedAccountKey === `account-${account.id}` ? (
                <View
                  style={[
                    styles.accountStatusCircle,
                    {
                      backgroundColor: Colors.light.primary,
                      borderColor: Colors.light.primary,
                    },
                  ]}
                >
                  <Feather name="check" size={18} color={theme.white} />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {linkedOrganizer ? (
          <Pressable
            style={({ pressed }) => [
              styles.organizerSection,
              {
                backgroundColor: selectedAccountKey === `organizer-${linkedOrganizer.id}`
                  ? theme.white
                  : theme.backgroundSecondary,
                borderColor: selectedAccountKey === `organizer-${linkedOrganizer.id}`
                  ? Colors.light.primary
                  : Colors.light.backgroundSecondary,
              },
              pressed && styles.organizerSectionPressed,
            ]}
            onPress={() => handleSelectAccount(String(linkedOrganizer.id), "organizer")}
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
              {selectedAccountKey === `organizer-${linkedOrganizer.id}` ? (
                <View style={styles.organizerStatusWrapper}>
                  <View
                    style={[
                      styles.accountStatusCircle,
                      {
                        backgroundColor: Colors.light.primary,
                        borderColor: Colors.light.primary,
                      },
                    ]}
                  >
                    <Feather name="check" size={18} color={theme.white} />
                  </View>
                </View>
              ) : null}
            </View>
            <View style={styles.organizerMetaRow}>
              <Feather name="users" size={18} color={theme.textSecondary} />
              <Text style={[styles.organizerMetaText, { color: theme.textSecondary }]}
              >
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
          </Pressable>
        ) : showOrganizeEventCta ? (
          <View style={styles.organizeEventCard}>
            <View style={styles.organizeIconContainer}>
              <Image source={require("../assets/Confetti.png")} style={styles.organizeIconImage} />
            </View>
            <Text style={[styles.organizeText, { color: theme.text }]}>Organiza tu Evento</Text>
          </View>
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
    marginBottom: Spacing.xs - 20,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },

  accountRowPressed: {
    opacity: 0.85,
  },

  accountContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarWrapper: {
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
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },

  accountStatusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.md,
  },

  organizeEventCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSecondary,
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },

  organizeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E3E3E3",
    borderWidth: 1,
    borderColor: Colors.light.backgroundTertiary,
    justifyContent: "center",
    alignItems: "center",
  },

  organizeIconImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  organizeText: {
    fontSize: 17,
    fontWeight: "600",
  },
  organizerSection: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  organizerStatusWrapper: {
    justifyContent: "center",
  },
  organizerStatusCircle: {
    marginLeft: Spacing.md,
  },
  organizerSectionPressed: {
    opacity: 0.85,
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
