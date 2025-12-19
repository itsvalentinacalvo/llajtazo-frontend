import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";

import { ThemedText } from "@/src/core/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/src/core/constants/theme";
import {
  EVENT_IMAGE_FRAME_HEIGHT,
  clamp,
  getImageMetrics,
} from "@/src/modules/business/utils/imageAdjustment";
import { EventImageData } from "@/src/modules/business/types/event";

type Theme = typeof Colors.light;

interface ImageAdjustmentsProps {
  visible: boolean;
  image: EventImageData | null;
  frameWidth: number;
  onCancel: () => void;
  onSave: (offsetY: number) => void;
  theme: Theme;
  frameHeight?: number;
}

export function ImageAdjustments({
  visible,
  image,
  frameWidth,
  onCancel,
  onSave,
  theme,
  frameHeight = EVENT_IMAGE_FRAME_HEIGHT,
}: ImageAdjustmentsProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [offset, setOffset] = useState(0);
  const minOffsetRef = useRef(0);
  const startOffsetRef = useRef(0);
  const offsetRef = useRef(0);

  // Usar el mismo tamaño de frame que en NuevoEventoScreen (agrandado)
  const effectiveFrameWidth = useMemo(() => {
    const horizontalPadding = 2 * (Spacing.xl + Spacing.lg);
    const availableWidth = Math.max(windowWidth - horizontalPadding, 0);
    // Si el frameWidth es suficientemente grande, usarlo, si no, usar el availableWidth
    return Math.min(frameWidth, availableWidth);
  }, [frameWidth, windowWidth]);

  const applyOffset = useCallback((rawOffset: number) => {
    const clamped = clamp(rawOffset, minOffsetRef.current, 0);
    offsetRef.current = clamped;
    setOffset(clamped);
  }, []);

  useEffect(() => {
    if (!visible || !image || effectiveFrameWidth <= 0) {
      return;
    }

    const { minOffset } = getImageMetrics(image, effectiveFrameWidth, frameHeight);
    minOffsetRef.current = minOffset;
    const initialOffset = clamp(image.offsetY, minOffset, 0);
    startOffsetRef.current = initialOffset;
    offsetRef.current = initialOffset;
    setOffset(initialOffset);
  }, [visible, image, effectiveFrameWidth, frameHeight]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gestureState) =>
          Math.abs(gestureState.dy) > 1,
        onPanResponderGrant: () => {
          startOffsetRef.current = offsetRef.current;
        },
        onPanResponderMove: (_evt, gestureState) => {
          applyOffset(startOffsetRef.current + gestureState.dy);
        },
        onPanResponderRelease: (_evt, gestureState) => {
          applyOffset(startOffsetRef.current + gestureState.dy);
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [applyOffset]
  );

  if (!visible || !image || effectiveFrameWidth <= 0) {
    return null;
  }

  // Usar frameHeight agrandado igual que en NuevoEventoScreen
  const enlargedFrameHeight = frameHeight * 1.9;
  const { scaledHeight } = getImageMetrics(image, effectiveFrameWidth, enlargedFrameHeight);

  const handleSave = () => {
    const nextOffset = clamp(offsetRef.current, minOffsetRef.current, 0);
    onSave(nextOffset);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            {
              backgroundColor: theme.backgroundRoot,
            },
          ]}
        >
          <ThemedText style={styles.title}>Ajusta la imagen</ThemedText>

          <View
            style={[styles.frame, { width: effectiveFrameWidth, height: enlargedFrameHeight }]}
            {...panResponder.panHandlers}
          >
            <Image
              source={{ uri: image.uri }}
              style={{
                width: effectiveFrameWidth,
                height: scaledHeight,
                transform: [{ translateY: offset }],
              }}
              contentFit="cover"
            />
          </View>

          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
            Desliza la imagen para elegir la parte que se mostrará.
          </ThemedText>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.ghostButton, { borderColor: theme.inputBorder }]}
              onPress={onCancel}
            >
              <ThemedText style={[styles.ghostButtonText, { color: theme.text }]}>
                Cancelar
              </ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <ThemedText style={styles.primaryButtonText}>Guardar</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  content: {
    width: "100%",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  frame: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
    marginTop: Spacing.lg,
    backgroundColor: "#000000",
  },
  hint: {
    fontSize: 13,
    textAlign: "center",
    marginTop: Spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  ghostButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
