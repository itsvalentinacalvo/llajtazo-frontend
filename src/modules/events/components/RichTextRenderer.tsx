import React from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";

type RichTextRendererProps = {
  html?: string;
  color: string;
};

export function RichTextRenderer({ html, color }: RichTextRendererProps) {
  const { width } = useWindowDimensions();

  const systemFonts = [...defaultSystemFonts, "system-ui"];

  return (
    <RenderHTML
      contentWidth={width}
      source={{ html: html || "<p></p>" }}
      baseStyle={{
        color,
        fontFamily: "system-ui",
        fontSize: 16,
        lineHeight: 24,
      }}
      systemFonts={systemFonts}
      tagsStyles={{
        p: {
          marginBottom: 12,
        },
        ul: {
          marginBottom: 12,
          paddingLeft: 22,
        },
        ol: {
          marginBottom: 12,
          paddingLeft: 22,
        },
        li: {
          marginBottom: 6,
        },
        strong: {
          fontWeight: "700",
        },
        b: {
          fontWeight: "700",
        },
        em: {
          fontStyle: "italic",
        },
        i: {
          fontStyle: "italic",
        },
        h1: {
          fontSize: 22,
          fontWeight: "700",
          marginTop: 16,
          marginBottom: 12,
        },
        h2: {
          fontSize: 20,
          fontWeight: "700",
          marginTop: 14,
          marginBottom: 10,
        },
        h3: {
          fontSize: 18,
          fontWeight: "700",
          marginTop: 12,
          marginBottom: 8,
        },
      }}
      enableExperimentalMarginCollapsing={true}
      ignoredStyles={["letterSpacing"]}
    />
  );
}
