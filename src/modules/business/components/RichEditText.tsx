import React, { useMemo, useRef } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";

import { Colors, Spacing, BorderRadius } from "@/src/core/constants/theme";

type Theme = typeof Colors.light;

type IconRendererProps = {
  tintColor?: string;
};

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type IconRenderer = (props: IconRendererProps) => React.ReactNode;

const toolbarConfig: ReadonlyArray<{ action: string; icon: FeatherIconName }> = [
  { action: actions.setBold, icon: "bold" },
  { action: actions.setItalic, icon: "italic" },
  { action: actions.setUnderline, icon: "underline" },
  { action: actions.alignLeft, icon: "align-left" },
  { action: actions.alignCenter, icon: "align-center" },
  { action: actions.alignRight, icon: "align-right" },
  { action: actions.insertBulletsList, icon: "list" },
  { action: actions.insertOrderedList, icon: "hash" },
  { action: actions.undo, icon: "corner-up-left" },
  { action: actions.redo, icon: "corner-up-right" },
];

export interface RICHEDITTEXTProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme: Theme;
  contentCSSText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  editorStyle?: StyleProp<ViewStyle>;
}

export function RICHEDITTEXT({
  value,
  onChange,
  placeholder = "Escribe los detalles del evento...",
  theme,
  contentCSSText = "font-family: system-ui; font-size: 14px; line-height: 22px;",
  containerStyle,
  editorStyle,
}: RICHEDITTEXTProps) {
  const editorRef = useRef<RichEditor | null>(null);

  const iconMap = useMemo(
    () =>
      toolbarConfig.reduce<Record<string, IconRenderer>>(
        (map, { action, icon }) => {
          map[action] = ({ tintColor }: IconRendererProps) => (
            <Feather name={icon} size={18} color={tintColor ?? theme.textSecondary} />
          );
          return map;
        },
        {}
      ),
    [theme.textSecondary]
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.inputBorder,
          backgroundColor: theme.inputBackground,
        },
        containerStyle,
      ]}
    >
      <RichToolbar
        editor={editorRef}
        actions={toolbarActions}
        style={[styles.toolbar, { borderBottomColor: theme.inputBorder }]}
        iconTint={theme.textSecondary}
        selectedIconTint={theme.primary}
        selectedButtonStyle={styles.toolbarButtonSelected}
        iconMap={iconMap}
      />
      <RichEditor
        ref={editorRef}
        initialContentHTML={value}
        onChange={(html) => onChange(html ?? "")}
        placeholder={placeholder}
        editorStyle={{
          backgroundColor: theme.inputBackground,
          color: theme.text,
          placeholderColor: theme.textSecondary,
          contentCSSText,
        }}
        style={[styles.editor, editorStyle]}
      />
    </View>
  );
}

const toolbarActions = toolbarConfig.map(({ action }) => action);

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
    minHeight: 560,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.md,
  },
});
