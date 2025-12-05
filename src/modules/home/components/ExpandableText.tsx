import React, { useState } from "react";
import { Pressable, StyleSheet, Text, type TextStyle } from "react-native";
import { ThemedText, type ThemedTextProps } from "@/src/core/components/ThemedText";
import { Colors } from "@/src/core/constants/theme";

interface Props {
  text: string;
  maxChars?: number;
  visibleChars?: number;
  type?: ThemedTextProps["type"];
  style?: TextStyle | TextStyle[];
  readMoreLabel?: string;
  readLessLabel?: string;
}

export default function ExpandableText({
  text,
  maxChars = 200,
  visibleChars = 150,
  type = "body",
  style,
  readMoreLabel = "Ver mas",
  readLessLabel = "Ver menos",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const displayText = text.slice(0, maxChars);
  const needsTruncation = displayText.length > visibleChars;
  const truncatedText = displayText.slice(0, visibleChars);

  if (!needsTruncation) {
    return (
      <ThemedText type={type} style={[styles.text, style]}>
        {displayText}
      </ThemedText>
    );
  }

  return (
    <>
      <ThemedText type={type} style={[styles.text, style]}>
        {expanded ? displayText : truncatedText}
        {!expanded ? "... " : " "}
        <Text 
          style={styles.link} 
          onPress={() => setExpanded(!expanded)}
        >
          {expanded ? readLessLabel : readMoreLabel}
        </Text>
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    color: Colors.light.primary,
    fontWeight: "500",
  },
});
