import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";

import { useTheme } from "@/src/core/hooks/useTheme";
import { useScreenInsets } from "@/src/core/hooks/useScreenInsets";
import { Spacing } from "@/src/core/constants/theme";

interface ScreenScrollViewProps extends ScrollViewProps {
  contentHorizontalPadding?: number;
}

export function ScreenScrollView({
  children,
  contentContainerStyle,
  style,
  contentHorizontalPadding = Spacing.xl,
  ...scrollViewProps
}: ScreenScrollViewProps) {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();
  console.debug("[Core][ScreenScrollView] render", { paddingTop, paddingBottom });

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop,
          paddingBottom,
          paddingHorizontal: contentHorizontalPadding,
        },
        styles.contentContainer,
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
  },
});
