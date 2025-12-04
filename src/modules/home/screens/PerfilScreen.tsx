import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  TextInput,
  ImageSourcePropType,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import { ThemedText } from "@/src/core/components/ThemedText";
import { ThemedView } from "@/src/core/components/ThemedView";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, BorderRadius, Colors, Typography, CategoryPillColors } from "@/src/core/constants/theme";
import ExpandableText from "@/src/modules/home/components/ExpandableText";
import { ShareTab } from '@/src/core/components/ShareTab';
import { EditPhotoTab } from '@/src//modules/home/components/EditPhotoTab';
import * as ImagePicker from 'expo-image-picker';
import { SwitchAccountTab, AccountProfile } from '@/src/core/components/SwitchAccountTab';
import { useHomeHeader } from "@/src/core/components/HomeHeaderContext";
import { interests as AVAILABLE_INTERESTS } from "@/src/modules/auth/screens/InterestsScreen";
import { ScreenKeyboardAwareScrollView } from "@/src/core/components/ScreenKeyboardAwareScrollView";
import {
  PROFILE_ACCOUNTS,
  PROFILE_BUSINESS_LINK,
  PROFILE_SCREEN_DETAILS,
  PROFILE_DEFAULT_AVATAR,
} from "@/src/core/test/profileData";

const PILL_COLORS = CategoryPillColors;

export default function PerfilScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { headerHeight } = useHomeHeader();
  const {
    name: defaultProfileName,
    bio: defaultProfileBio,
    interests: defaultProfileInterests,
    stats: profileStats,
  } = PROFILE_SCREEN_DETAILS;
  const { isLinked: isBusinessLinked, organizer: linkedOrganizer } = PROFILE_BUSINESS_LINK;
  const [accounts, setAccounts] = useState<AccountProfile[]>(() =>
    PROFILE_ACCOUNTS.map((account, index) => ({
      ...account,
      isSelected: index === 0,
    }))
  );
  const [activeAccountId, setActiveAccountId] = useState<string | null>(
    PROFILE_ACCOUNTS[0]?.id ?? null
  );
  const resolvedActiveAccountId = activeAccountId ?? accounts[0]?.id ?? null;
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState<string>(defaultProfileName);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const nameInputRef = useRef<TextInput | null>(null);
  const [nameWidth, setNameWidth] = useState(0);
  const [bioText, setBioText] = useState<string>(defaultProfileBio);
  const [isBioEditing, setIsBioEditing] = useState(false);
  const bioInputRef = useRef<TextInput | null>(null);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [profileInterests, setProfileInterests] = useState<string[]>(() => [...defaultProfileInterests]);

  // Map selected interest id -> color index assigned when selected.
  // This mapping stays stable while an interest remains selected so other
  // selected pills don't change color when one is deselected.
  const [selectionColorMap, setSelectionColorMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    defaultProfileInterests.forEach((id, i) => {
      map[id] = i % PILL_COLORS.length;
    });
    return map;
  });

  // Mutable refs for next color index and freed color indices (FIFO reuse).
  const nextColorIndexRef = useRef<number>(profileInterests.length % PILL_COLORS.length);
  const freedColorsRef = useRef<number[]>([]);



  const handleEditProfile = () => {
    if (isEditing) {
      // Save flow: persist local state and close any field editors
      setIsNameEditing(false);
      setIsBioEditing(false);
      setIsEditing(false);
      setBioText(bioText.trim());
      if (resolvedActiveAccountId) {
        setAccounts((prev) =>
          prev.map((account) => {
            if (account.id !== resolvedActiveAccountId) {
              return account;
            }
            return {
              ...account,
              name: username,
              avatar: pendingAvatar ?? account.avatar,
            };
          })
        );
        if (pendingAvatar) {
          setPendingAvatar(null);
        }
      }
      // TODO: call API to save profile
    } else {
      setIsEditing(true);
    }
  };

  const toggleInterest = (id: string) => {
    setProfileInterests((prev) =>
      prev.includes(id) ? prev.filter((it) => it !== id) : [...prev, id]
    );
  };

  const scrollRef = useRef<ScrollView | null>(null);
  const handleScrollRef = useCallback((ref: ScrollView | null) => {
    scrollRef.current = ref;
  }, []);
  const [shareVisible, setShareVisible] = useState(false);
  const [switchVisible, setSwitchVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
  // temporary selected avatar URI while editing; applied on Save
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);

  const ensurePermissions = async (forCamera: boolean) => {
    try {
      if (Platform.OS !== 'web') {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaStatus !== 'granted') {
          console.log('Media library permission not granted');
          return false;
        }
        if (forCamera) {
          const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
          if (camStatus !== 'granted') {
            console.log('Camera permission not granted');
            return false;
          }
        }
      }
      return true;
    } catch (e) {
      console.log('permission error', e);
      return false;
    }
  };

  const handlePickPhoto = async () => {
    const ok = await ensurePermissions(false);
    if (!ok) return;
    try {
      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      const uri = result?.assets?.[0]?.uri ?? result?.uri;
      if (!result.cancelled && uri) {
        setPendingAvatar(uri);
      }
    } catch (e) {
      console.log('pick error', e);
    } finally {
      setEditPhotoVisible(false);
    }
  };

  const handleTakePhoto = async () => {
    const ok = await ensurePermissions(true);
    if (!ok) return;
    try {
      const result: any = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      const uri = result?.assets?.[0]?.uri ?? result?.uri;
      if (!result.cancelled && uri) {
        setPendingAvatar(uri);
      }
    } catch (e) {
      console.log('camera error', e);
    } finally {
      setEditPhotoVisible(false);
    }
  };

  // Account selection is kept locally so the screen reflects edits immediately.

  const selectedAccount =
    accounts.find((account) => account.id === resolvedActiveAccountId) ??
    accounts[0] ??
    null;
  const resolveAvatarSource = (
    avatar: AccountProfile["avatar"] | undefined | null
  ): ImageSourcePropType | undefined => {
    if (!avatar) return undefined;
    return typeof avatar === "string"
      ? { uri: avatar }
      : (avatar as ImageSourcePropType);
  };
  const defaultAvatarSource =
    resolveAvatarSource(accounts[0]?.avatar ?? PROFILE_ACCOUNTS[0]?.avatar) ??
    PROFILE_DEFAULT_AVATAR;
  const avatarSource: ImageSourcePropType = pendingAvatar
    ? { uri: pendingAvatar }
    : resolveAvatarSource(selectedAccount?.avatar) ?? defaultAvatarSource;

  const handleSelectAccount = (accountId: string) => {
    setActiveAccountId(accountId);
    setAccounts((prev) =>
      prev.map((account) => ({
        ...account,
        isSelected: account.id === accountId,
      }))
    );
    setSwitchVisible(false);
  };

  const toggleEditingInterests = () => {
    if (isEditingInterests) {
      // Exiting edit mode: assign colors in order to the currently selected interests
      const newMap: Record<string, number> = {};
      profileInterests.forEach((id, idx) => {
        newMap[id] = idx % PILL_COLORS.length;
      });
      setSelectionColorMap(newMap);
      nextColorIndexRef.current = profileInterests.length % PILL_COLORS.length;
      freedColorsRef.current = [];
      setIsEditingInterests(false);
    } else {
      // Entering edit mode: keep UI as-is, selected pills will show primary color while editing
      setIsEditingInterests(true);
      // Scroll to bottom so all options are visible (delay to allow layout)
      setTimeout(() => {
        try {
          scrollRef.current?.scrollToEnd({ animated: true });
        } catch {
          // ignore
        }
      }, 150);
    }
  };

  

  return (
    <ThemedView style={styles.root}>
      {/* Top Navigation Bar */}
      <View style={[styles.topNavBar, { top: insets.top }]}>
        <Pressable style={styles.topNavButton} onPress={() => (navigation as any).openDrawer()}>
          <Feather name="menu" size={24} color={theme.text} />
        </Pressable>
        <Pressable style={styles.topNavButton} onPress={() => setShareVisible(true)}>
          <Feather name="share-2" size={24} color={theme.text} />
        </Pressable>
      </View>

      <ScreenKeyboardAwareScrollView
        innerRef={handleScrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          {isEditing && (
            <Pressable style={styles.profileImageOverlay} onPress={() => setEditPhotoVisible(true)}>
              <Entypo name="camera" size={28} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userNameContainer}>
          <View style={styles.userNameCenter}>
            {isNameEditing ? (
              <TextInput
                ref={nameInputRef}
                value={username}
                onChangeText={(t) => setUsername(t ? t.charAt(0).toUpperCase() + t.slice(1) : t)}
                style={[styles.nameInput, { color: theme.text }]}
                selectionColor={theme.text}
                onSubmitEditing={() => setIsNameEditing(false)}
                returnKeyType="done"
                autoFocus
                autoCapitalize="sentences"
                onLayout={(e) => setNameWidth(e.nativeEvent.layout.width)}
              />
            ) : (
              <ThemedText type="h2" style={styles.userName} onLayout={(e) => setNameWidth(e.nativeEvent.layout.width)}>
                {username}
              </ThemedText>
            )}
          </View>

          <View style={[
            styles.nameIconWrapper,
            { transform: [{ translateX: nameWidth / 2 + Spacing.xs }] },
          ]} pointerEvents="box-none">
            {isNameEditing ? null : isEditing ? (
                <Pressable
                  onPress={() => {
                    setIsNameEditing(true);
                    setTimeout(() => nameInputRef.current?.focus(), 50);
                  }}
                >
                  <Feather name="edit-2" size={16} color={theme.textSecondary} />
                </Pressable>
            ) : (
              <Pressable onPress={() => setSwitchVisible(true)} style={{ padding: Spacing.xs }}>
                <Feather name="chevron-down" size={16} color={theme.textSecondary} style={styles.downIcon} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, styles.statItemLeft]}>
            <ThemedText type="h4" style={styles.statNumber}>
              {profileStats.following.toLocaleString("es-BO")}
            </ThemedText>
            <ThemedText type="small" style={styles.statLabel}>
              Siguiendo
            </ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={[styles.statItem, styles.statItemRight]}>
            <ThemedText type="h4" style={styles.statNumber}>
              {profileStats.tickets.toLocaleString("es-BO")}
            </ThemedText>
            <ThemedText type="small" style={styles.statLabel}>
              Tickets
            </ThemedText>
          </View>
        </View>

        {/* Edit Profile Button */}
        <Pressable
          style={({ pressed }) => [
            isEditing ? styles.saveButton : styles.editButton,
            pressed && (isEditing ? styles.saveButtonPressed : styles.editButtonPressed),
          ]}
          onPress={handleEditProfile}
        >
          {!isEditing && <Feather name="edit-2" size={18} color={Colors.light.primary} />}
          <ThemedText
            type="body"
            style={isEditing ? styles.saveButtonText : [styles.editButtonText, { color: Colors.light.primary }]}
          >
            {isEditing ? "Guardar" : "Editar Perfil"}
          </ThemedText>
        </Pressable>

        {/* Biografía Section */}
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText type="h4" style={styles.sectionTitle}>
                Biografía
              </ThemedText>
              {isEditing && (
                <Pressable
                  onPress={() => {
                    setIsBioEditing(true);
                    setTimeout(() => bioInputRef.current?.focus(), 50);
                  }}
                  style={{ padding: Spacing.xs }}
                >
                  <Feather name="edit-2" size={16} color={theme.textSecondary} />
                </Pressable>
              )}
            </View>

          {isBioEditing ? (
            <TextInput
              ref={bioInputRef}
              value={bioText}
              onChangeText={setBioText}
              multiline
              style={[
                styles.bioInput,
                { color: theme.text, borderColor: Colors.light.inputBorder, backgroundColor: Colors.light.inputBackground },
              ]}
              selectionColor={theme.text}
              returnKeyType="done"
            />
          ) : (
            <ExpandableText
              text={bioText}
              numberOfLines={2}
              type="body"
              style={[styles.bioText, { color: theme.textSecondary }]}
            />
          )}
        </View>

        {/* Intereses Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.interesesHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Intereses
            </ThemedText>
            <Pressable
              style={({ pressed }) => [
                styles.editInteresesButton,
                pressed && styles.editInteresesButtonPressed,
              ]}
              onPress={toggleEditingInterests}
            >
              {isEditingInterests ? (
                <ThemedText type="small" style={styles.saveInteresesText}>
                  GUARDAR
                </ThemedText>
              ) : (
                <>
                  <Feather name="edit-2" size={14} color={Colors.light.primary} />
                  <ThemedText
                    type="small"
                    style={[{ color: Colors.light.primary, marginLeft: 6, fontWeight: "600" }]}
                  >
                    EDITAR
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>

          {/* Interest Tags */}
          <View style={[styles.tagsContainer, isEditingInterests ? styles.tagsContainerEditing : styles.tagsContainerDisplay]}>
            {isEditingInterests
              ? AVAILABLE_INTERESTS.filter((i: any) => !i.isHidden).map((interest: any) => {
                  const isSelected = profileInterests.includes(interest.id);
                  // While editing: show selected pills as primary blue
                  const bgColor = isSelected ? Colors.light.primary : Colors.light.white;
                  const borderColor = isSelected ? Colors.light.primary : theme.textSecondary;
                  const textColor = isSelected ? Colors.light.white : theme.textSecondary;
                  return (
                    <Pressable
                      key={interest.id}
                      onPress={() => toggleInterest(interest.id)}
                      style={({ pressed }) => [
                        styles.interestTag,
                        {
                          backgroundColor: bgColor,
                          borderColor,
                          borderWidth: 2,
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <ThemedText type="small" style={[styles.interestTagText, { color: textColor }]}>
                        {interest.label}
                      </ThemedText>
                    </Pressable>
                  );
                })
              : profileInterests.map((id) => {
                  const info = AVAILABLE_INTERESTS.find((i: any) => i.id === id) || { id, label: id };
                  const colorIndex = typeof selectionColorMap[id] === "number" ? selectionColorMap[id] : AVAILABLE_INTERESTS.findIndex((i: any) => i.id === id) % PILL_COLORS.length;
                  const pillColor = PILL_COLORS[colorIndex];
                  return (
                    <View
                      key={id}
                      style={[
                        styles.interestTag,
                        styles.interestTagDisplay,
                        { backgroundColor: pillColor, borderColor: pillColor, borderWidth: 2 },
                      ]}
                    >
                      <ThemedText type="small" style={[styles.interestTagText, { color: Colors.light.white }]}>
                        {info.label}
                      </ThemedText>
                    </View>
                  );
                })}
          </View>
        </View>

        {/* Promotional section removed per request */}
      </ScreenKeyboardAwareScrollView>

      <ShareTab visible={shareVisible} onClose={() => setShareVisible(false)} />
      <SwitchAccountTab
        visible={switchVisible}
        onClose={() => setSwitchVisible(false)}
        accounts={accounts}
        onSelectAccount={handleSelectAccount}
        linkedOrganizer={isBusinessLinked ? linkedOrganizer ?? undefined : undefined}
        showOrganizeEventCta={!isBusinessLinked}
      />
      <EditPhotoTab
        visible={editPhotoVisible}
        onClose={() => setEditPhotoVisible(false)}
        onTakePhoto={handleTakePhoto}
        onPickPhoto={handlePickPhoto}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topNavBar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    zIndex: 100,
  },
  topNavButton: {
    padding: Spacing.sm,
  },
  topNavIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  userNameContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    marginBottom: Spacing.md,
  },
  userNameCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  nameIconWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    left: '50%',
  },
  inlineRightIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  downIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginLeft: Spacing.xs,
    transform: [{ translateY: -3 }],
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    textAlign: "left",
  },
  backIconImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.backgroundSecondary,
  },

  profileImageOverlay: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(60,60,60,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  nameInput: {
    textAlign: "center",
    marginBottom: Spacing.md,
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.h2.fontWeight,
    paddingVertical: 2,
    minWidth: 160,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    width: '100%',
  },
  statItem: {
    flex: 1,
    justifyContent: 'center',
  },
  statItemLeft: {
    alignItems: 'center',
    paddingRight: 0,
    marginRight: -75,
  },
  statItemRight: {
    alignItems: 'center',
    paddingLeft: 0,
    marginLeft: -75,
  },
  statNumber: {
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.light.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -0.5 }],
  },
  editButton: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl + 30,
    width: 160,
    alignSelf: "center",
  },
  editButtonPressed: {
    opacity: 0.8,
  },
  editButtonText: {
    fontWeight: "600",
    fontSize: Typography.button.fontSize + 2,
  },
  editButtonIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  saveButton: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xl + 30,
    width: 160,
    alignSelf: "center",
    backgroundColor: Colors.light.primary,
    position: "relative",
  },
  saveButtonPressed: {
    opacity: 0.9,
  },
  saveButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
    textAlign: "center",
    fontSize: Typography.button.fontSize + 2,
  },
  saveButtonIcon: {
    position: "absolute",
    left: Spacing.md,
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  sectionContainer: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  tagsContainerDisplay: {
    // Match bottom padding used in editing mode so pills aren't cut off
    paddingBottom: Spacing.xl,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 18,
    textAlign: "justify",
    letterSpacing: -0.3,
  },
  bioInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 96,
    textAlignVertical: 'top',
    fontSize: Typography.body.fontSize,
    lineHeight: 20,
  },
  inlineEditIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginLeft: Spacing.xs,
    transform: [{ translateY: -4 }],
  },
  bioTextCollapsed: {
    marginBottom: Spacing.md,
  },
  readMoreLink: {
    color: Colors.light.primary,
    marginTop: 6,
  },
  interesesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  editIconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  editInteresesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 14,
    backgroundColor: "rgba(43, 187, 255, 0.1)",
    gap: 6,
    marginTop: -Spacing.lg,
  },
  editInteresesButtonPressed: {
    opacity: 0.7,
  },
  saveInteresesText: {
    color: Colors.light.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    alignItems: 'center',
  },
  tagsContainerEditing: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Spacing.xl + 10,
  },
  interestTag: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.sm -1,
  },
  interestTagDisplay: {
    // Horizontal spacing used only when NOT editing
    marginHorizontal: Spacing.xs,
  },
  interestTagText: {
    color: Colors.light.white,
    fontWeight: "600",
    textAlign: "center",
    fontSize: Typography.body.fontSize,
  },
  // Promotional section removed
});
