import React, { forwardRef } from "react";
import { Platform, StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

import { useTheme } from "@/src/core/hooks/useTheme";
import { useScreenInsets } from "@/src/core/hooks/useScreenInsets";
import { Spacing } from "@/src/core/constants/theme";
import { ScreenScrollView } from "@/src/core/components/ScreenScrollView";

/**
 * Forward ref so callers can call scroll methods (e.g. scrollToEnd)
 */
export const ScreenKeyboardAwareScrollView = forwardRef<KeyboardAwareScrollView, KeyboardAwareScrollViewProps>(
  (
    { children, contentContainerStyle, style, keyboardShouldPersistTaps = "handled", ...scrollViewProps },
    ref
  ) => {
    const { theme } = useTheme();
    const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

    if (Platform.OS === "web") {
      return (
        <ScreenScrollView
          ref={ref as any}
          style={style}
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          {...scrollViewProps}
        >
          {children}
        </ScreenScrollView>
      );
    }

    return (
      <KeyboardAwareScrollView
        ref={ref as any}
        style={[
          styles.container,
          { backgroundColor: theme.backgroundRoot },
          style,
        ]}
        contentContainerStyle={[
          {
            paddingTop,
            paddingBottom,
          },
          styles.contentContainer,
          contentContainerStyle,
        ]}
        scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...scrollViewProps}
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
});
