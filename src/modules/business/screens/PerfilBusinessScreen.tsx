import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Modal,
  Text,
  Animated,
  Dimensions,
  Image as RNImage,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Feather, Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { ShareTab } from "@/src/core/components/ShareTab";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius, Spacing, Colors, Typography } from "@/src/core/constants/theme";
import { useBusiness } from "@/src/modules/business/context/BusinessContext";
import { BUSINESS_ORGANIZER, BUSINESS_EVENTS, ORGANIZER_REVIEWS } from "@/src/modules/business/test/businessData";
import { PROFILE_ACCOUNTS } from "@/src/core/test/profileData";
import { navigationRef } from "@/src/core/navigation/navigationRef";

const { height } = Dimensions.get("window");

type ProfileTab = "INFO" | "EVENTOS" | "OPINIONES";

function formatFollowers(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count.toString();
}

function SocialIcon({ type, onPress }: { type: string; onPress: () => void }) {
  const iconSize = 28;
  const iconColor = "#FFFFFF";

  const getIconConfig = () => {
    switch (type) {
      case "facebook":
        return { bg: "#1877F2", icon: <FontAwesome name="facebook" size={iconSize} color={iconColor} /> };
      case "instagram":
        return { bg: "#E4405F", icon: <FontAwesome name="instagram" size={iconSize} color={iconColor} /> };
      case "tiktok":
        return { bg: "#000000", icon: <FontAwesome5 name="tiktok" size={iconSize - 4} color={iconColor} /> };
      case "whatsapp":
        return { bg: "#25D366", icon: <FontAwesome name="whatsapp" size={iconSize} color={iconColor} /> };
      case "youtube":
        return { bg: "#FF0000", icon: <FontAwesome name="youtube-play" size={iconSize} color={iconColor} /> };
      case "twitter":
        return { bg: "#000000", icon: <FontAwesome name="twitter" size={iconSize} color={iconColor} /> };
      default:
        return { bg: "#666666", icon: <Feather name="link" size={iconSize} color={iconColor} /> };
    }
  };

  const config = getIconConfig();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.socialIcon, { backgroundColor: config.bg }]}
    >
      {config.icon}
    </Pressable>
  );
}

function StarRating({ rating }: { rating: number }) {
  const { theme } = useTheme();
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={16}
          color={star <= rating ? "#FFD700" : theme.textSecondary}
        />
      ))}
    </View>
  );
}

function EventCard({ event, onPress }: { event: any; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Pressable style={[styles.eventCard, { backgroundColor: theme.backgroundDefault }]} onPress={onPress}>
      <Image source={event.image} style={styles.eventCardImage} contentFit="cover" />
      <View style={styles.eventCardContent}>
        <ThemedText style={[styles.eventCardDate, { color: theme.primary }]}>
          {event.date} - {event.time}
        </ThemedText>
        <ThemedText style={styles.eventCardTitle} numberOfLines={2}>
          {event.title}
        </ThemedText>
        <View style={styles.eventCardLocation}>
          <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.eventCardLocationText, { color: theme.textSecondary }]}>
            {event.location}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

function ReviewCard({ review }: { review: any }) {
  const { theme } = useTheme();

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={review.userAvatar} style={styles.reviewAvatar} contentFit="cover" />
        <View style={styles.reviewInfo}>
          <ThemedText style={styles.reviewUserName}>{review.userName}</ThemedText>
          <StarRating rating={review.rating} />
        </View>
        <ThemedText style={[styles.reviewDate, { color: theme.textSecondary }]}>
          {review.date}
        </ThemedText>
      </View>
      <ThemedText style={[styles.reviewComment, { color: theme.textSecondary }]}>
        {review.comment}
      </ThemedText>
    </View>
  );
}

interface SwitchAccountBusinessTabProps {
  visible: boolean;
  onClose: () => void;
  businessAccount: {
    id: string;
    name: string;
    logo: any;
    about: string;
    followers: number;
  };
  personalAccount?: {
    id: string;
    name: string;
    avatar: any;
  } | null;
  onSelectBusiness: () => void;
  onSelectPersonal: () => void;
  currentAccount?: "business" | "personal";
}

function SwitchAccountBusinessTab({
  visible,
  onClose,
  businessAccount,
  personalAccount,
  onSelectBusiness,
  onSelectPersonal,
  currentAccount = "business",
}: SwitchAccountBusinessTabProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [selectedKey, setSelectedKey] = useState<"business" | "personal">(currentAccount);

  useEffect(() => {
    setSelectedKey(currentAccount);
  }, [currentAccount]);

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

  const handleSelectBusiness = () => {
    setSelectedKey("business");
    onSelectBusiness();
    onClose();
  };

  const handleSelectPersonal = () => {
    setSelectedKey("personal");
    onSelectPersonal();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={switchStyles.overlay} onPress={onClose} accessible={false} />

      <Animated.View
        style={[
          switchStyles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: theme.white,
          },
        ]}
      >
        <View style={switchStyles.handle} />

        <Text style={[switchStyles.title, { color: theme.text }]}>
          Cambiar de cuenta
        </Text>

        <View style={switchStyles.accountsList}>
          <Pressable
            onPress={handleSelectBusiness}
            style={({ pressed }) => [
              switchStyles.accountSection,
              {
                backgroundColor: selectedKey === "business" ? theme.white : theme.backgroundSecondary,
                borderColor: selectedKey === "business" ? Colors.light.primary : Colors.light.backgroundSecondary,
              },
              pressed && switchStyles.accountPressed,
            ]}
          >
            <View style={switchStyles.accountHeader}>
              <Image source={businessAccount.logo} style={switchStyles.accountLogo} contentFit="cover" />
              <View style={switchStyles.accountDetails}>
                <Text style={[switchStyles.accountName, { color: theme.text }]}>
                  {businessAccount.name}
                </Text>
                <Text
                  style={[switchStyles.accountAbout, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  Business Partner
                </Text>
              </View>
              {selectedKey === "business" ? (
                <View
                  style={[
                    switchStyles.statusCircle,
                    {
                      backgroundColor: Colors.light.primary,
                      borderColor: Colors.light.primary,
                    },
                  ]}
                >
                  <Feather name="check" size={18} color={theme.white} />
                </View>
              ) : null}
            </View>
            <View style={switchStyles.metaRow}>
              <Feather name="users" size={16} color={theme.textSecondary} />
              <Text style={[switchStyles.metaText, { color: theme.textSecondary }]}>
                {businessAccount.followers.toLocaleString("es-BO")} seguidores
              </Text>
              <View style={[switchStyles.dot, { backgroundColor: Colors.light.primary }]} />
              <Text style={[switchStyles.metaText, { color: Colors.light.primary }]}>
                Cuenta Vinculada
              </Text>
            </View>
          </Pressable>

          {personalAccount ? (
            <Pressable
              onPress={handleSelectPersonal}
              style={({ pressed }) => [
                switchStyles.personalRow,
                {
                  backgroundColor: selectedKey === "personal" ? theme.white : theme.backgroundSecondary,
                  borderColor: selectedKey === "personal" ? Colors.light.primary : Colors.light.backgroundSecondary,
                },
                pressed && switchStyles.accountPressed,
              ]}
            >
              <View style={switchStyles.personalContent}>
                <View style={switchStyles.avatarWrapper}>
                  {personalAccount.avatar ? (
                    <RNImage
                      source={
                        typeof personalAccount.avatar === "string"
                          ? { uri: personalAccount.avatar }
                          : personalAccount.avatar
                      }
                      style={switchStyles.personalAvatar}
                    />
                  ) : (
                    <View style={[switchStyles.personalAvatar, switchStyles.avatarPlaceholder]}>
                      <Feather name="user" size={28} color={theme.textSecondary} />
                    </View>
                  )}
                </View>
                <Text style={[switchStyles.personalName, { color: theme.text }]} numberOfLines={1}>
                  {personalAccount.name}
                </Text>
              </View>
              {selectedKey === "personal" ? (
                <View
                  style={[
                    switchStyles.statusCircle,
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
          ) : null}
        </View>
      </Animated.View>
    </Modal>
  );
}

export default function PerfilBusinessScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { events, logoutBusiness } = useBusiness();

  const [activeTab, setActiveTab] = useState<ProfileTab>("INFO");
  const [shareVisible, setShareVisible] = useState(false);
  const [switchVisible, setSwitchVisible] = useState(false);

  const organizer = BUSINESS_ORGANIZER;
  const organizerEvents = events.length > 0 ? events : BUSINESS_EVENTS;
  const reviews = ORGANIZER_REVIEWS;

  const personalAccount = PROFILE_ACCOUNTS.length > 0
    ? {
        id: String(PROFILE_ACCOUNTS[0].id),
        name: PROFILE_ACCOUNTS[0].name,
        avatar: PROFILE_ACCOUNTS[0].avatar,
      }
    : null;

  const openBurgerMenu = useCallback(() => {
    const nav: any = navigation;
    try {
      nav?.dispatch?.(
        CommonActions.navigate({ name: "BusinessBurgerMenu" })
      );
    } catch (err) {
      console.debug("[Business][PerfilScreen] navigate BurgerMenu failed", err);
    }
  }, [navigation]);

  const handleSharePress = () => {
    setShareVisible(true);
  };

  const handleSocialPress = (url: string) => {
    Linking.openURL(url).catch((err) => console.log("Error opening URL:", err));
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
  };

  const handleEventPress = (eventId: string) => {
    (navigation as any).navigate("MetricasDetail", { eventId });
  };

  const handleNamePress = () => {
    setSwitchVisible(true);
  };

  const handleSelectBusiness = () => {
    console.log("Business account selected - staying in business mode");
  };

  const handleSelectPersonal = () => {
    console.log("Switching to personal account");
    logoutBusiness();
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "Home" as never }],
      });
    }
  };

  const socialLinks = [
    { type: "facebook", url: "https://facebook.com/alicepark" },
    { type: "instagram", url: "https://instagram.com/alicepark" },
    { type: "tiktok", url: "https://tiktok.com/@alicepark" },
    { type: "whatsapp", url: "https://wa.me/59170000000" },
    { type: "youtube", url: "https://youtube.com/alicepark" },
  ];

  const bioText = organizer.bio;

  const renderTabContent = () => {
    switch (activeTab) {
      case "INFO":
        return (
          <View style={styles.tabContent}>
            <View style={styles.bioSection}>
              <ThemedText style={styles.bioText}>
                {bioText}
              </ThemedText>
            </View>

            <View style={styles.socialLinksContainer}>
              {socialLinks.map((link, index) => (
                <SocialIcon
                  key={index}
                  type={link.type}
                  onPress={() => handleSocialPress(link.url)}
                />
              ))}
            </View>
          </View>
        );

      case "EVENTOS":
        return (
          <View style={styles.tabContent}>
            {organizerEvents.map((event) => (
              <EventCard
                key={event.id}
                eventId={event.id}
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </View>
        );

      case "OPINIONES":
        return (
          <View style={styles.tabContent}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={openBurgerMenu} style={styles.headerButton}>
          <Feather name="menu" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerSpacer} />
        <Pressable onPress={handleSharePress} style={styles.headerButton}>
          <Feather name="external-link" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={organizer.logo} style={styles.avatar} contentFit="cover" />
          </View>

          <Pressable style={styles.nameContainer} onPress={handleNamePress}>
            <ThemedText type="h2" style={styles.name}>{organizer.name}</ThemedText>
            <Feather name="chevron-down" size={18} color={theme.textSecondary} />
          </Pressable>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{organizer.following}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                Siguiendo
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {formatFollowers(organizer.followers)}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                Seguidores
              </ThemedText>
            </View>
          </View>

          <Pressable
            style={[styles.editButton, { borderColor: theme.primary }]}
            onPress={handleEditProfile}
          >
            <Feather name="edit-2" size={18} color={theme.primary} />
            <ThemedText style={[styles.editButtonText, { color: theme.primary }]}>
              Editar Perfil
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.tabsContainer}>
          {(["INFO", "EVENTOS", "OPINIONES"] as ProfileTab[]).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                activeTab === tab && { borderBottomColor: theme.primary },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? theme.primary : theme.textSecondary },
                ]}
              >
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>

      <ShareTab
        visible={shareVisible}
        onClose={() => setShareVisible(false)}
        title="Comparte tu perfil"
      />

      <SwitchAccountBusinessTab
        visible={switchVisible}
        onClose={() => setSwitchVisible(false)}
        businessAccount={{
          id: organizer.id,
          name: organizer.name,
          logo: organizer.logo,
          about: organizer.bio,
          followers: organizer.followers,
        }}
        personalAccount={personalAccount}
        onSelectBusiness={handleSelectBusiness}
        onSelectPersonal={handleSelectPersonal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
  bioSection: {
    marginBottom: Spacing.xl,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
  },
  socialLinksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  eventCard: {
    flexDirection: "row",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  eventCardImage: {
    width: 90,
    height: 90,
  },
  eventCardContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
  },
  eventCardDate: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  eventCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  eventCardLocationText: {
    fontSize: 13,
  },
  reviewCard: {
    marginBottom: Spacing.lg,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: Spacing.md,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  starContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 13,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

const switchStyles = StyleSheet.create({
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
    gap: Spacing.md,
  },
  accountSection: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
  },
  accountPressed: {
    opacity: 0.85,
  },
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  accountLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Spacing.lg,
  },
  accountDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
  accountName: {
    fontSize: 18,
    fontWeight: "700",
  },
  accountAbout: {
    fontSize: 14,
    lineHeight: 18,
  },
  statusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  personalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  personalContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarWrapper: {
    marginRight: Spacing.lg,
  },
  personalAvatar: {
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
  personalName: {
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },
});
