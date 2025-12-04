import React, { useState } from "react";
import { Pressable, StyleSheet, type TextStyle } from "react-native";
import { ThemedText, type ThemedTextProps } from "@/src/core/components/ThemedText";

interface Props {
  text: string;
  numberOfLines?: number;
  type?: ThemedTextProps["type"];
  style?: TextStyle | TextStyle[];
  readMoreLabel?: string;
  readLessLabel?: string;
}

export default function ExpandableText({
  text,
  numberOfLines = 2,
  type = "body",
  style,
  readMoreLabel = "Leer más",
  readLessLabel = "Leer menos",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [measured, setMeasured] = useState(false);

  return (
    <>
      <ThemedText
        type={type}
        style={[styles.text, style]}
        numberOfLines={expanded ? undefined : measured ? numberOfLines : undefined}
        onTextLayout={(e) => {
          // Only measure once (first layout) without truncation so we can know total lines
          if (!measured) {
            if (e.nativeEvent.lines.length > numberOfLines) {
              setShowToggle(true);
            }
            setMeasured(true);
          }
        }}
      >
        {text}
      </ThemedText>

      {showToggle && (
        <Pressable onPress={() => setExpanded(!expanded)}>
          <ThemedText type="link" style={styles.link}>
            {expanded ? readLessLabel : readMoreLabel}
          </ThemedText>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  link: {
    marginTop: 4,
  },
});
