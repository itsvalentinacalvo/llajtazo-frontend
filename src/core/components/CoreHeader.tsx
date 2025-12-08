import React from "react";
import { StyleSheet, View, LayoutChangeEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BorderRadius, Spacing } from "@/src/core/constants/theme";
import { TopBar } from "./TopBarHamburgerMenu&Notif";
import { SearchBar } from "./SearchBar";
import { CategoryFilters } from "./CategoryFilters";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useStatusBarStyle } from "@/src/core/context/StatusBarContext";

interface CoreHeaderProps {
  onSearchChange?: (text: string) => void;
  onFilterPress?: () => void;
  onCategoryPress?: (label: string | undefined) => void;
  selectedCategory?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const CATEGORY_PILL_HEIGHT = 42;
const CATEGORY_OVERLAP = CATEGORY_PILL_HEIGHT / 2;

function CoreHeaderImpl({
  onSearchChange,
  onFilterPress,
  onCategoryPress,
  selectedCategory,
  onLayout,
}: CoreHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  useStatusBarStyle("light", "#2BBBFF");

  const handleNotificationPress = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "Notifications",
      })
    );
  };

  return (
    <View style={styles.wrapper} onLayout={onLayout} pointerEvents="box-none">
      <LinearGradient
        colors={["#2BBBFF", "#1DA8E6"]}
        style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TopBar onNotificationPress={handleNotificationPress} />
        <SearchBar
          onSearchChange={onSearchChange}
          onFilterPress={onFilterPress}
        />
      </LinearGradient>
      <View style={styles.categoryContainer} pointerEvents="box-none">
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryPress={onCategoryPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  container: {
    backgroundColor: "#2BBBFF",
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl + CATEGORY_OVERLAP,
    paddingHorizontal: Spacing.xl,
  },
  categoryContainer: {
    marginTop: -CATEGORY_OVERLAP,
  },
});

export const CoreHeader = React.memo(CoreHeaderImpl);

export default CoreHeader;
