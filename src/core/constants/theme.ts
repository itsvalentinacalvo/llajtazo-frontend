import { Platform } from "react-native";

const primaryBlue = "#2BBBFF";
const primaryBlueDark = "#1DA8E6";

export const Colors = {
  light: {
    primary: primaryBlue,
    primaryDark: primaryBlueDark,
    accent: "#00F8FF",
    accentBg: "#00F8FF29",
    orange: "#FFCD6C",
    text: "#1A1A1A",
    textSecondary: "#747688",
    buttonText: "#FFFFFF",
    tabIconDefault: "#747688",
    tabIconSelected: primaryBlue,
    link: primaryBlue,
    white: "#FFFFFF",
    border: "#E5E5E5",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F9F9F9",
    backgroundSecondary: "#F2F2F2",
    backgroundTertiary: "#E6E6E6",
    inputBackground: "#FFFFFF",
    inputBorder: "#E5E5E5",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 56,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 33,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  hero: {
    fontSize: 28,
    fontWeight: "600" as const,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 14,
    fontWeight: "600" as const,
    textDecorationLine: "underline" as const,
  },
  button: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#505688",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 8,
  },
  categoryPill: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
