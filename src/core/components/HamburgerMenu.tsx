import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/src/core/hooks/useTheme";
import { useUser } from "@/src/core/context/UserContext";
import { Typography, Spacing } from "@/src/core/constants/theme";

interface MenuItem {
  icon: string;
  iconType?: "feather" | "ionicons";
  label: string;
  onPress: () => void;
}

export function CustomDrawerContent(props: any) {
  const { theme } = useTheme();
  const { user, accounts, activeAccountId } = useUser();
  const displayName = user?.name || "";

  const menuItems: MenuItem[] = [
    {
      icon: "user",
      label: "Mi Perfil",
      onPress: () => console.log("Mi Perfil"),
    },
    {
      icon: "calendar",
      label: "Calendario",
      onPress: () => console.log("Calendario"),
    },
    {
      icon: "bookmark",
      label: "Guardado",
      onPress: () => console.log("Guardado"),
    },
    {
      icon: "ticket-outline",
      iconType: "ionicons",
      label: "Tus Tickets",
      onPress: () => console.log("Tus Tickets"),
    },
    {
      icon: "settings",
      label: "Configuración",
      onPress: () => console.log("Configuración"),
    },
    {
      icon: "help-circle",
      label: "Contáctanos",
      onPress: () => console.log("Contáctanos"),
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.backgroundRoot }}
    >
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { paddingBottom: Spacing.xl }] }>
          <View style={styles.profileColumn}>
            <Image
              source={
                (() => {
                  const sel = accounts.find((a) => a.id === activeAccountId) || accounts[0];
                  if (sel && sel.avatar) return typeof sel.avatar === 'string' ? { uri: sel.avatar } : sel.avatar as any;
                  return { uri: "https://i.pravatar.cc/150?img=12" };
                })()
              }
              style={styles.profileImage}
            />

            <Text style={[styles.profileNameColumn, { color: theme.text }]} numberOfLines={2}>
              {displayName}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              {item.iconType === "ionicons" ? (
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={theme.textSecondary}
                />
              ) : (
                <Feather
                  name={item.icon as any}
                  size={20}
                  color={theme.textSecondary}
                />
              )}

              <Text style={[styles.menuLabel, { color: theme.text }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable
            onPress={() => console.log("Cerrar Sesión")}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="log-out" size={20} color={theme.textSecondary} />
            <Text style={[styles.menuLabel, { color: theme.text }]}>
              Cerrar Sesión
            </Text>
          </Pressable>
        </View>

        {/* Vuelvete PRO Button */}
        <View style={styles.proSection}>
          <Pressable
            style={styles.proBadge}
            onPress={() => console.log("Vuelvete PRO")}
          >
            <Feather name="star" size={16} color="#FFFFFF" />
            <Text style={styles.proText}>Vuelvete PRO</Text>
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

// NameRenderer removed; using absolute-positioned Text for full single-line rendering

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  profileSection: {
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    // Add extra bottom padding because the profile name is rendered
    // absolutely (so it no longer contributes to the container height).
    paddingBottom: Spacing.xl,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  profileAvatarAndName: {
    alignItems: "center",
    overflow: 'visible',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: Spacing.sm,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    flexShrink: 0,
  },
  profileNameRow: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: Spacing.md,
    flexShrink: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  profileNameColumn: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  menuSection: {
    paddingTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  menuLabel: {
    fontSize: Typography.body.fontSize,
    marginLeft: Spacing.md,
  },
  proSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    marginTop: "auto",
    paddingBottom: Spacing.xl,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2BBBFF",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
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
