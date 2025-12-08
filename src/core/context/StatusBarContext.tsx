import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import { Colors } from "@/src/core/constants/theme";
import { NavigationContext } from "@react-navigation/native";

interface StatusBarConfig {
  style: StatusBarStyle;
  backgroundColor?: string;
  animated?: boolean;
}

const DEFAULT_STATUS_BAR: StatusBarConfig = {
  style: "dark",
  backgroundColor: Colors.light.statusBarBackground,
  animated: true,
};

type StatusBarContextValue = {
  setStatusBar: (config: StatusBarConfig) => void;
  resetStatusBar: () => void;
};

const StatusBarControllerContext = createContext<StatusBarContextValue | undefined>(undefined);
const noop = () => {};
const FALLBACK_CONTEXT: StatusBarContextValue = {
  setStatusBar: noop,
  resetStatusBar: noop,
};

export function StatusBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StatusBarConfig>(DEFAULT_STATUS_BAR);

  const setStatusBar = useCallback((next: StatusBarConfig) => {
    setConfig((prev) => {
      const nextConfig: StatusBarConfig = {
        style: next.style ?? prev.style,
        backgroundColor: next.backgroundColor ?? prev.backgroundColor,
        animated: next.animated ?? prev.animated,
      };

      if (
        nextConfig.style === prev.style &&
        nextConfig.backgroundColor === prev.backgroundColor &&
        nextConfig.animated === prev.animated
      ) {
        return prev;
      }

      return nextConfig;
    });
  }, []);

  const resetStatusBar = useCallback(() => {
    setConfig(DEFAULT_STATUS_BAR);
  }, []);

  const value = useMemo(() => ({ setStatusBar, resetStatusBar }), [resetStatusBar, setStatusBar]);

  return (
    <StatusBarControllerContext.Provider value={value}>
      {children}
      <StatusBar style={config.style} backgroundColor={config.backgroundColor} animated={config.animated} />
    </StatusBarControllerContext.Provider>
  );
}

export function useStatusBarController() {
  const context = useContext(StatusBarControllerContext);
  return context ?? FALLBACK_CONTEXT;
}

export function useStatusBarStyle(
  style: StatusBarStyle,
  backgroundColor?: string,
  animated: boolean = true,
) {
  const { setStatusBar, resetStatusBar } = useStatusBarController();
  const navigation = useContext(NavigationContext);

  useEffect(() => {
    if (!navigation) {
      setStatusBar({ style, backgroundColor, animated });
      return () => {
        resetStatusBar();
      };
    }

    const apply = () => setStatusBar({ style, backgroundColor, animated });
    const restore = () => resetStatusBar();

    const unsubscribeFocus = navigation.addListener?.("focus", apply);
    const unsubscribeBlur = navigation.addListener?.("blur", restore);

    if (navigation.isFocused?.()) {
      apply();
    }

    return () => {
      unsubscribeFocus?.();
      unsubscribeBlur?.();
      restore();
    };
  }, [animated, backgroundColor, navigation, resetStatusBar, setStatusBar, style]);
}

function hexChannelToLinear(channel: number): number {
  const normalized = channel / 255;
  if (normalized <= 0.03928) {
    return normalized / 12.92;
  }
  return Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(color: string): number {
  const hex = color.replace("#", "");
  if (hex.length !== 6 && hex.length !== 3) {
    return 1;
  }

  const normalized = hex.length === 3
    ? hex.split("").map((c) => c + c).join("")
    : hex;

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  const rLin = hexChannelToLinear(r);
  const gLin = hexChannelToLinear(g);
  const bLin = hexChannelToLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

export function getStatusBarStyleForColor(color: string, threshold: number = 0.6): StatusBarStyle {
  const luminance = getRelativeLuminance(color);
  return luminance > threshold ? "dark" : "light";
}

export function useStatusBarColor(color: string, animated: boolean = true) {
  const style = getStatusBarStyleForColor(color);
  useStatusBarStyle(style, color, animated);
}
