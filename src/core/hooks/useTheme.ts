import { Colors } from "@/src/core/constants/theme";

export function useTheme() {
  const colorScheme = "light" as const;

  return {
    theme: Colors.light,
    colorScheme,
  };
}
