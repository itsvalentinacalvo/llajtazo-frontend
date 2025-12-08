import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { SkeletonBox, SkeletonCircle, SkeletonText, SkeletonCard, SkeletonPill } from "./Skeleton";
import { Colors, Spacing, BorderRadius } from "@/src/core/constants/theme";

const CATEGORY_PILL_HEIGHT = 42;
const CATEGORY_OVERLAP = CATEGORY_PILL_HEIGHT / 2;

function SkeletonHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.primaryDark]}
        style={[styles.headerContainer, { paddingTop: insets.top + Spacing.lg }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTopBar}>
          <SkeletonCircle size={40} animate={true} style={styles.headerIcon} />
          <SkeletonBox style={styles.headerLogo} animate={true} />
          <SkeletonCircle size={40} animate={true} style={styles.headerIcon} />
        </View>
        <View style={styles.searchBarSkeleton}>
          <SkeletonBox style={styles.searchBar} animate={true} />
        </View>
      </LinearGradient>
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonPill key={i} width={80} height={38} style={styles.categoryPill} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function SkeletonTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.lg }]}>
      <View style={styles.tabsRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.tabItem}>
            <SkeletonCircle size={24} animate={true} />
            <SkeletonText width={40} height={10} animate={true} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function ExplorarScreenSkeleton() {
  return (
    <View style={styles.screen}>
      <SkeletonHeader />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SkeletonText width={150} height={20} style={styles.sectionTitle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((i) => (
              <SkeletonCard
                key={i}
                imageHeight={140}
                titleWidth="90%"
                subtitleWidth="70%"
                style={[styles.eventCard, { width: 280 }]}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SkeletonText width={180} height={20} style={styles.sectionTitle} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard
                key={i}
                imageHeight={100}
                titleWidth="85%"
                subtitleWidth="60%"
                style={[styles.smallEventCard, { width: 160 }]}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SkeletonText width={200} height={20} style={styles.sectionTitle} />
          <View style={styles.gridContainer}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard
                key={i}
                imageHeight={100}
                titleWidth="80%"
                subtitleWidth="50%"
                style={styles.gridCard}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <SkeletonTabBar />
    </View>
  );
}

export function EventosScreenSkeleton() {
  return (
    <View style={styles.screen}>
      <SkeletonHeader />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SkeletonText width={180} height={20} style={styles.sectionTitle} />
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.eventListItem}>
              <SkeletonBox style={styles.eventListImage} />
              <View style={styles.eventListContent}>
                <SkeletonText width="90%" height={16} style={{ marginBottom: Spacing.xs }} />
                <SkeletonText width="70%" height={12} style={{ marginBottom: Spacing.xs }} />
                <SkeletonText width="50%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <SkeletonTabBar />
    </View>
  );
}

export function MapaScreenSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <SkeletonHeader />
      <View style={styles.mapContainer}>
        <SkeletonBox style={styles.mapPlaceholder} />
      </View>
      <View style={[styles.mapCardsContainer, { bottom: 80 + (insets.bottom > 0 ? insets.bottom : Spacing.lg) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((i) => (
            <SkeletonCard
              key={i}
              imageHeight={80}
              titleWidth="85%"
              subtitleWidth="60%"
              style={[styles.mapCard, { width: 240 }]}
            />
          ))}
        </ScrollView>
      </View>
      <SkeletonTabBar />
    </View>
  );
}

export function PerfilScreenSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.perfilHeader, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.perfilTopBar}>
          <SkeletonCircle size={32} />
          <SkeletonCircle size={32} />
        </View>
        <View style={styles.perfilAvatarContainer}>
          <SkeletonCircle size={100} />
        </View>
        <View style={styles.perfilNameContainer}>
          <SkeletonText width={180} height={24} style={{ marginBottom: Spacing.sm }} />
          <SkeletonText width={220} height={14} />
        </View>
        <View style={styles.perfilStatsRow}>
          <View style={styles.perfilStat}>
            <SkeletonText width={40} height={20} style={{ marginBottom: Spacing.xs }} />
            <SkeletonText width={60} height={12} />
          </View>
          <View style={styles.perfilStat}>
            <SkeletonText width={40} height={20} style={{ marginBottom: Spacing.xs }} />
            <SkeletonText width={60} height={12} />
          </View>
        </View>
        <SkeletonPill width={140} height={44} style={styles.perfilEditButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <SkeletonText width={100} height={18} style={styles.sectionTitle} />
          <SkeletonText width="100%" height={14} lines={3} lineSpacing={8} />
        </View>
        <View style={styles.section}>
          <SkeletonText width={100} height={18} style={styles.sectionTitle} />
          <View style={styles.interestsContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonPill key={i} width={80 + (i * 10)} height={34} style={styles.interestPill} />
            ))}
          </View>
        </View>
      </ScrollView>
      <SkeletonTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.backgroundDefault,
  },
  headerWrapper: {
    zIndex: 10,
  },
  headerContainer: {
    backgroundColor: Colors.light.primary,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl + CATEGORY_OVERLAP,
    paddingHorizontal: Spacing.xl,
  },
  headerTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  headerLogo: {
    width: 100,
    height: 30,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  searchBarSkeleton: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    height: 48,
    borderRadius: BorderRadius.xl,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  categoryContainer: {
    marginTop: -CATEGORY_OVERLAP,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.xl,
  },
  categoryPill: {
    marginRight: Spacing.sm,
    backgroundColor: Colors.light.white,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
  },
  tabsRow: {
    flexDirection: "row",
    paddingTop: Spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  eventCard: {
    marginRight: Spacing.md,
  },
  smallEventCard: {
    marginRight: Spacing.md,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridCard: {
    width: "48%",
  },
  eventListItem: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
  },
  eventListImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  eventListContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: "center",
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: "#E8E8E8",
  },
  mapCardsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
  },
  mapCard: {
    marginRight: Spacing.md,
  },
  perfilHeader: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: "center",
  },
  perfilTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.lg,
  },
  perfilAvatarContainer: {
    marginBottom: Spacing.lg,
  },
  perfilNameContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  perfilStatsRow: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
  },
  perfilStat: {
    alignItems: "center",
    marginHorizontal: Spacing.xl,
  },
  perfilEditButton: {
    backgroundColor: Colors.light.primary,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  interestPill: {
    backgroundColor: Colors.light.backgroundTertiary,
  },
});

export default {
  Explorar: ExplorarScreenSkeleton,
  Eventos: EventosScreenSkeleton,
  Mapa: MapaScreenSkeleton,
  Perfil: PerfilScreenSkeleton,
};
