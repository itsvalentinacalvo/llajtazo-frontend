import React, { useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { BorderRadius } from "@/src/core/constants/theme";

interface SpotifyEmbedProps {
  embedUrl: string;
  height?: number;
}

export function SpotifyEmbed({ embedUrl, height = 250 }: SpotifyEmbedProps) {
  const { theme } = useTheme();
  const iframeHtml = useMemo(
    () => `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { margin: 0; padding: 0; background: transparent; }
      iframe { border-radius: 12px; }
    </style>
  </head>
  <body>
    <iframe data-testid="embed-iframe" style="border-radius:12px" src="${embedUrl}" width="100%" height="${height}" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  </body>
</html>`,
    [embedUrl, height]
  );

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { height, backgroundColor: theme.backgroundSecondary }]}>
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: 12, width: "100%", height }}
          src={embedUrl}
          width="100%"
          height={height}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: iframeHtml }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="small">Cargando reproductor...</ThemedText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});
