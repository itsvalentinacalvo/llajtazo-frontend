import React, { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { Colors, Spacing, BorderRadius } from "@/src/core/constants/theme";

type Theme = typeof Colors.light;
type IconRendererProps = { tintColor?: string };
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
  onFocus?: () => void;
}

export type RICHEDITTEXTRef = {
  focus: () => void;
  blur: () => void;
  getHTML: () => Promise<string>;
};

const RICHEDITTEXT = forwardRef<RICHEDITTEXTRef, RICHEDITTEXTProps>(
  (
    {
      value,
      onChange,
      placeholder,
      theme,
      contentCSSText,
      containerStyle,
      editorStyle,
      onFocus,
    },
    ref
  ) => {
    const editorRef = useRef<RichEditor | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focusContentEditor?.(),
      blur: () => editorRef.current?.blurContentEditor?.(),
      getHTML: async () =>
        editorRef.current?.getContentHtml?.() ?? value ?? "",
    }));

    const iconMap = useMemo(() => {
      return toolbarConfig.reduce<Record<string, IconRenderer>>((map, { action, icon }) => {
        map[action] = ({ tintColor }) => (
          <Feather name={icon} size={18} color={tintColor ?? theme.textSecondary} />
        );
        return map;
      }, {});
    }, [theme.textSecondary]);

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
          actions={toolbarConfig.map((t) => t.action)}
          iconMap={iconMap}
          iconTint={theme.textSecondary}
          selectedIconTint={theme.primary}
          style={[styles.toolbar, { borderBottomColor: theme.inputBorder }]}
        />

        <RichEditor
          ref={editorRef}
          initialContentHTML={value?.trim() ? value : "<p></p>"}
          placeholder={placeholder}
          onChange={(html) => onChange(html ?? "")}
          onFocus={onFocus}
          scrollEnabled
          editorStyle={{
            backgroundColor: theme.inputBackground,
            color: theme.text,
            contentCSSText,
          }}
          style={[styles.editor, editorStyle]}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: "hidden",
    minHeight: 300,
  },
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
  },
  editor: {
    minHeight: 300,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
});

export default RICHEDITTEXT;
