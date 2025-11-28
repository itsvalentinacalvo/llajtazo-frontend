import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "@/src/core/constants/theme";

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const contextTabBarHeight = useContext(BottomTabBarHeightContext as any) as number | null;
  const tabBarHeight =
    // Prefer context-provided value when available (used inside BottomTabNavigator)
    contextTabBarHeight ??
    // Fallback to safe-area inset or a spacing value
    (insets.bottom || Spacing.lg);

  return {
    paddingTop: headerHeight + Spacing.xl,
    paddingBottom: tabBarHeight + Spacing.xl,
    scrollInsetBottom: insets.bottom + 16,
  };
}
