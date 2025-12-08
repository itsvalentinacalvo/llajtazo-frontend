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
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import { ThemedText } from "@/src/core/components/ThemedText";
import { ThemedView } from "@/src/core/components/ThemedView";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, BorderRadius, Colors, Typography, CategoryPillColors } from "@/src/core/constants/theme";
import ExpandableText from "@/src/modules/home/components/ExpandableText";
import { ShareTab } from '@/src/core/components/ShareTab';
import { EditPhotoTab } from '@/src/modules/home/components/EditPhotoTab';
import * as ImagePicker from 'expo-image-picker';
import { SwitchAccountTab, AccountProfile } from '@/src/modules/home/components/SwitchAccountTab';
import { interests as AVAILABLE_INTERESTS } from "@/src/modules/auth/screens/InterestsScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useProfile } from "@/src/core/context/ProfileContext";
import {
  PROFILE_ACCOUNTS,
  PROFILE_BUSINESS_LINK,
  PROFILE_DEFAULT_AVATAR,
} from "@/src/core/test/profileData";

const PILL_COLORS = CategoryPillColors;
const TOP_NAV_HEIGHT = 50;
const AVATAR_SIZE = 120;
const AVATAR_BORDER_WIDTH = 3;
const BIO_MAX_CHARS = 200;
const BIO_VISIBLE_CHARS = 150;
const TAB_BAR_HEIGHT = 88;

export default function PerfilScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { profile, updateName, updateBio, updateAvatar, updateInterests } = useProfile();
  
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
  const [username, setUsername] = useState<string>(profile.name);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const nameInputRef = useRef<TextInput | null>(null);
  const [nameWidth, setNameWidth] = useState(0);
  const [bioText, setBioText] = useState<string>(profile.bio.slice(0, BIO_MAX_CHARS));
  const bioInputRef = useRef<TextInput | null>(null);
  const [profileInterests, setProfileInterests] = useState<string[]>(() => [...profile.interests]);
  
  const openBurgerMenu = useCallback(() => {
    const nav: any = navigation;
    try {
      if (typeof nav?.navigate === "function") {
        nav.navigate("BurgerMenu");
        return;
      }
    } catch (err) {
      console.debug("[Home][PerfilScreen] navigate BurgerMenu via navigate failed", err);
    }

    try {
      nav?.dispatch?.(
        CommonActions.navigate({
          name: "BurgerMenu",
        })
      );
      return;
    } catch (err) {
      console.debug("[Home][PerfilScreen] navigate BurgerMenu via dispatch failed", err);
    }

    const parentNav: any = nav?.getParent?.();
    if (typeof parentNav?.navigate === "function") {
      parentNav.navigate("BurgerMenu");
    }
  }, [navigation]);

  const [selectionColorMap, setSelectionColorMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    profile.interests.forEach((id, i) => {
      map[id] = i % PILL_COLORS.length;
    });
    return map;
  });

  const nextColorIndexRef = useRef<number>(profileInterests.length % PILL_COLORS.length);
  const freedColorsRef = useRef<number[]>([]);

  const handleEditProfile = () => {
    if (isEditing) {
      setIsNameEditing(false);
      setIsEditing(false);
      const trimmedBio = bioText.trim().slice(0, BIO_MAX_CHARS);
      setBioText(trimmedBio);
      
      updateName(username);
      updateBio(trimmedBio);
      updateInterests(profileInterests);
      
      if (pendingAvatar) {
        updateAvatar({ uri: pendingAvatar } as ImageSourcePropType);
      }
      
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
    } else {
      setIsEditing(true);
    }
  };

  const handleBioChange = (text: string) => {
    if (text.length <= BIO_MAX_CHARS) {
      setBioText(text);
    }
  };

  const toggleInterest = (id: string) => {
    setProfileInterests((prev) =>
      prev.includes(id) ? prev.filter((it) => it !== id) : [...prev, id]
    );
  };

  const scrollRef = useRef<ScrollView | null>(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [switchVisible, setSwitchVisible] = useState(false);
  const [editPhotoVisible, setEditPhotoVisible] = useState(false);
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });
      const uri = result?.assets?.[0]?.uri;
      if (!result.canceled && uri) {
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
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });
      const uri = result?.assets?.[0]?.uri;
      if (!result.canceled && uri) {
        setPendingAvatar(uri);
      }
    } catch (e) {
      console.log('camera error', e);
    } finally {
      setEditPhotoVisible(false);
    }
  };

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
    : resolveAvatarSource(selectedAccount?.avatar) ?? profile.avatar ?? defaultAvatarSource;

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

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.topNavBar, { top: insets.top }]}>
        <Pressable style={styles.topNavButton} onPress={openBurgerMenu}>
          <Feather name="menu" size={24} color={theme.text} />
        </Pressable>
        <Pressable style={styles.topNavButton} onPress={() => setShareVisible(true)}>
          <Feather name="share" size={22} color={theme.text} />
        </Pressable>
      </View>

      <View style={[styles.fixedHeader, { paddingTop: insets.top + TOP_NAV_HEIGHT + Spacing.lg }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={avatarSource}
              style={styles.avatarImage}
              resizeMode="cover"
            />
            {isEditing && (
              <Pressable style={styles.profileImageOverlay} onPress={() => setEditPhotoVisible(true)}>
                <Entypo name="camera" size={32} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.userNameContainer}>
          <View style={styles.userNameRow}>
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
              <>
                <ThemedText type="h2" style={styles.userName} onLayout={(e) => setNameWidth(e.nativeEvent.layout.width)}>
                  {username}
                </ThemedText>
                {isEditing ? (
                  <Pressable
                    onPress={() => {
                      setIsNameEditing(true);
                      setTimeout(() => nameInputRef.current?.focus(), 50);
                    }}
                    style={styles.nameEditIcon}
                  >
                    <Feather name="edit-2" size={14} color={theme.textSecondary} />
                  </Pressable>
                ) : (
                  <Pressable onPress={() => setSwitchVisible(true)} style={styles.nameChevron}>
                    <Feather name="chevron-down" size={18} color={theme.textSecondary} />
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {profile.stats.following.toLocaleString("es-BO")}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Siguiendo
            </ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {profile.stats.tickets.toLocaleString("es-BO")}
            </ThemedText>
            <ThemedText style={styles.statLabel}>
              Tickets
            </ThemedText>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            isEditing ? styles.saveButton : styles.editButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleEditProfile}
        >
          {!isEditing && <Feather name="edit-2" size={16} color={Colors.light.primary} style={styles.editButtonIcon} />}
          <ThemedText
            style={isEditing ? styles.saveButtonText : styles.editButtonText}
          >
            {isEditing ? "Guardar" : "Editar Perfil"}
          </ThemedText>
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        ref={scrollRef as any}
        style={styles.scrollableContent}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText style={styles.sectionTitle}>
              Biografía
            </ThemedText>
            {isEditing && (
              <ThemedText style={styles.charCounter}>
                {bioText.length}/{BIO_MAX_CHARS}
              </ThemedText>
            )}
          </View>

          {isEditing ? (
            <TextInput
              ref={bioInputRef}
              value={bioText}
              onChangeText={handleBioChange}
              multiline
              maxLength={BIO_MAX_CHARS}
              style={[
                styles.bioInput,
                { 
                  color: theme.text, 
                  borderColor: Colors.light.primary, 
                  backgroundColor: Colors.light.inputBackground,
                },
              ]}
              selectionColor={Colors.light.primary}
              scrollEnabled={false}
            />
          ) : (
            <ExpandableText
              text={bioText}
              maxChars={BIO_MAX_CHARS}
              visibleChars={BIO_VISIBLE_CHARS}
              type="body"
              style={styles.bioText}
              readMoreLabel="Ver mas"
              readLessLabel="Ver menos"
            />
          )}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <ThemedText style={styles.sectionTitle}>
              Intereses
            </ThemedText>
          </View>

          <View style={styles.tagsContainer}>
            {isEditing
              ? AVAILABLE_INTERESTS.filter((i: any) => !i.isHidden).map((interest: any) => {
                  const isSelected = profileInterests.includes(interest.id);
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
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                    >
                      <ThemedText style={[styles.interestTagText, { color: textColor }]}>
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
                        { backgroundColor: pillColor, borderColor: pillColor },
                      ]}
                    >
                      <ThemedText style={styles.interestTagText}>
                        {info.label}
                      </ThemedText>
                    </View>
                  );
                })}
          </View>
        </View>
      </KeyboardAwareScrollView>

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
    height: TOP_NAV_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    zIndex: 100,
  },
  topNavButton: {
    padding: Spacing.sm,
  },
  fixedHeader: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: Spacing.xl,
    zIndex: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: AVATAR_BORDER_WIDTH,
    borderColor: Colors.light.border,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: AVATAR_SIZE - AVATAR_BORDER_WIDTH * 2,
    height: AVATAR_SIZE - AVATAR_BORDER_WIDTH * 2,
    borderRadius: (AVATAR_SIZE - AVATAR_BORDER_WIDTH * 2) / 2,
  },
  profileImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(60, 60, 60, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
  },
  nameInput: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 2,
    minWidth: 160,
  },
  nameEditIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  nameChevron: {
    marginLeft: Spacing.xs,
    padding: Spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.light.border,
  },
  editButton: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    alignSelf: "center",
    minWidth: 160,
    backgroundColor: "transparent",
  },
  editButtonIcon: {
    marginRight: Spacing.sm,
  },
  editButtonText: {
    fontWeight: "500",
    fontSize: 15,
    color: Colors.light.primary,
  },
  saveButton: {
    flexDirection: "row",
    borderRadius: 10,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.xl + Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
    alignSelf: "center",
    backgroundColor: Colors.light.primary,
    opacity: 0.85,
  },
  saveButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  sectionContainer: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.text,
  },
  charCounter: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.light.textSecondary,
    textAlign: "left",
  },
  bioInput: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    textAlignVertical: 'top',
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  interestTagText: {
    color: Colors.light.white,
    fontWeight: "500",
    fontSize: 13,
  },
});
