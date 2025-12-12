import React, { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { Colors, Spacing, BorderRadius } from "@/src/core/constants/theme";

type Theme = typeof Colors.light;
type IconRendererProps = { tintColor?: string };
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];
type IconRenderer = (props: IconRendererProps) => React.ReactNode;

const toolbarConfig = [
  { action: actions.setBold, icon: "bold" },
  { action: actions.setItalic, icon: "italic" },
  { action: actions.setUnderline, icon: "underline" },
  { action: actions.insertBulletsList, icon: "list" },
  { action: actions.insertOrderedList, icon: "hash" },
  { action: actions.undo, icon: "corner-up-left" },
  { action: actions.redo, icon: "corner-up-right" },
] as const;

export interface RICHEDITTEXTProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: Theme;
  contentCSSText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  editorStyle?: StyleProp<ViewStyle>;
  enableOutsideBlur?: boolean;
}

// Expose a simple Imperative API: { blur(): void; focus(): void; getHTML(): Promise<string> }
export type RICHEDITTEXTRef = {
  blur: () => void;
  focus: () => void;
  getHTML: () => Promise<string>;
};

export const RICHEDITTEXT = forwardRef<RICHEDITTEXTRef | null, RICHEDITTEXTProps>(function RICHEDITTEXT(
  {
    value,
    onChange,
    placeholder = "Escribe los detalles del evento...",
    theme,
    contentCSSText = `
      * { font-family: system-ui; }
      body { font-size: 16px; line-height: 24px; margin: 0; padding: 0; }
      p { margin: 0 0 14px; }
      ul, ol { padding-left: 22px; margin: 0 0 14px; }
      li { margin: 6px 0; }
      strong, b { font-weight: 700; }
      em, i { font-style: italic; }
      br { display: block; margin-bottom: 10px; }
    `,
    containerStyle,
    editorStyle,
    enableOutsideBlur = true,
  },
  ref
) {
  const editorRef = useRef<RichEditor | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      blur: () => {
        try {
          editorRef.current?.blurContentEditor?.();
        } catch (err) {
          console.error("[RICHEDITTEXT] Error al hacer blur:", err);
        }
      },
      focus: () => {
        try {
          editorRef.current?.focusContentEditor?.();
        } catch (err) {
          console.error("[RICHEDITTEXT] Error al hacer focus:", err);
        }
      },
      getHTML: async () => {
        try {
          // getContentHtml is synchronous in this lib, but wrap for safety
          // @ts-ignore
          return editorRef.current?.getContentHtml?.() ?? (value ?? "");
        } catch (err) {
          console.error("[RICHEDITTEXT] Error al obtener HTML:", err);
          return value ?? "";
        }
      },
    }),
    [value]
  );

  const iconMap = useMemo(() => {
    return toolbarConfig.reduce<Record<string, IconRenderer>>((map, { action, icon }) => {
      map[action] = ({ tintColor }: IconRendererProps) => (
        <Feather name={icon} size={18} color={tintColor ?? theme.textSecondary} />
      );
      return map;
    }, {});
  }, [theme.textSecondary]);

  const safeInitialHTML = value?.trim()?.length > 0 ? value : "<p></p>";

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.inputBorder, backgroundColor: theme.inputBackground },
        containerStyle,
      ]}
      pointerEvents="box-none"
    >
      <RichToolbar
        editor={editorRef}
        actions={toolbarConfig.map((t) => t.action)}
        iconMap={iconMap}
        selectedButtonStyle={styles.toolbarButtonSelected}
        iconTint={theme.textSecondary}
        selectedIconTint={theme.primary}
        style={[styles.toolbar, { borderBottomColor: theme.inputBorder }]}
      />

      <RichEditor
        ref={editorRef}
        initialContentHTML={safeInitialHTML}
        onChange={(html) => {
          try {
            onChange(html ?? "");
          } catch (err) {
            console.error("[RICHEDITTEXT] Error en onChange:", err, { html });
          }
        }}
        placeholder={placeholder}
        editorStyle={{
          backgroundColor: theme.inputBackground,
          color: theme.text,
          placeholderColor: theme.textSecondary,
          contentCSSText,
        }}
        style={[styles.editor, editorStyle]}
        nestedScrollEnabled
        scrollEnabled
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    gap: Spacing.xs,
  },
  toolbarButtonSelected: {
    backgroundColor: "rgba(43, 187, 255, 0.18)",
    borderRadius: BorderRadius.xs,
  },
  editor: {
    minHeight: 280,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
  },
});

export default RICHEDITTEXT;
