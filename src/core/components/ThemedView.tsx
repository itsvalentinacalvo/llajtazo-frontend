import { View, type ViewProps } from "react-native";

import { useTheme } from "@/src/core/hooks/useTheme";

export type ThemedViewProps = ViewProps;

export function ThemedView({
  style,
  ...otherProps
}: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor = theme.backgroundRoot;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
