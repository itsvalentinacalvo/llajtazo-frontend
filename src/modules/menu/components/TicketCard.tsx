import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import Svg, { Rect, Circle, Defs, Mask, Line, RadialGradient, Stop } from "react-native-svg";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, Colors } from "@/src/core/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NOTCH_RADIUS = 16;
const NOTCH_Y_POSITION = 320;
const CORNER_RADIUS = 24;

export type Ticket = {
  title: string;
  venue: string;
  date: string;
  time: string;
  ticketId: string;
  image: any;
};

export default function TicketCard({
  ticket,
  width = SCREEN_WIDTH - Spacing.xl * 2,
  height = 565,
}: {
  ticket: Ticket;
  width?: number;
  height?: number;
}) {
  const { theme } = useTheme();

  function TicketShapeShadow({ width, height }: { width: number; height: number }) {
    const SHADOW_COLOR = Colors.light.primary;

    return (
      <View style={[styles.shadowSvgContainer, { width, height }]}>
        <Svg width={width} height={height}>
          <Defs>
            <Mask id="shadowMask">
              <Rect x="0" y="0" width={width} height={height} rx={CORNER_RADIUS} ry={CORNER_RADIUS} fill="white" />
              <Circle cx={0} cy={NOTCH_Y_POSITION} r={NOTCH_RADIUS} fill="black" />
              <Circle cx={width} cy={NOTCH_Y_POSITION} r={NOTCH_RADIUS} fill="black" />
            </Mask>

            <RadialGradient id="shadowGrad" cx={width / 2} cy={height / 2} rx={Math.max(width, height)} ry={Math.max(width, height)} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor={SHADOW_COLOR} stopOpacity={0.36} />
              <Stop offset="0.5" stopColor={SHADOW_COLOR} stopOpacity={0.18} />
              <Stop offset="1" stopColor={SHADOW_COLOR} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#shadowGrad)" mask="url(#shadowMask)" />
        </Svg>
      </View>
    );
  }

  function DashedLine({ width, color }: { width: number; color: string }) {
    const dashWidth = 8;
    const gapWidth = 6;
    const dashCount = Math.floor(width / (dashWidth + gapWidth));
    const patternLength = dashCount * (dashWidth + gapWidth);
    const startOffset = Math.max(0, (width - patternLength) / 2);

    return (
      <Svg width={width} height={2} style={styles.dashedLine}>
        {Array.from({ length: dashCount }).map((_, i) => {
          const xStart = startOffset + i * (dashWidth + gapWidth);
          return (
            <Line key={i} x1={xStart} y1={1} x2={xStart + dashWidth} y2={1} stroke={color} strokeWidth={2} strokeLinecap="round" />
          );
        })}
      </Svg>
    );
  }

  return (
    <View style={[styles.ticketWrapper, { width, height }]}>
      <View style={styles.shadowContainer}>
        <TicketShapeShadow width={width} height={height} />
      </View>

      <View style={[styles.ticketContainer, { width, height }]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill as any}>
          <Defs>
            <Mask id="ticketMask">
              <Rect x="0" y="0" width={width} height={height} rx={CORNER_RADIUS} ry={CORNER_RADIUS} fill="white" />
              <Circle cx={0} cy={NOTCH_Y_POSITION} r={NOTCH_RADIUS} fill="black" />
              <Circle cx={width} cy={NOTCH_Y_POSITION} r={NOTCH_RADIUS} fill="black" />
            </Mask>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill={theme.white} mask="url(#ticketMask)" stroke={theme.border} strokeWidth={1} rx={CORNER_RADIUS} ry={CORNER_RADIUS} />
        </Svg>

        <View style={[styles.ticketContent, { width, height }]}>
          <View style={styles.imageContainer}>
              <Image source={ticket.image} style={styles.eventImage} resizeMode="cover" />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.65)"]} style={styles.imageOverlay} />
              <View style={styles.imageHeader} pointerEvents="none">
                  <ThemedText numberOfLines={2} style={[styles.eventTitleOverlay, { color: theme.white }]}>{ticket.title}</ThemedText>
                  <View style={styles.venueRowOverlay}>
                    <Feather name="map-pin" size={14} color={theme.white} style={{ marginRight: 6, opacity: 0.9 }} />
                    <ThemedText numberOfLines={1} style={[styles.venueTextOverlay, { color: theme.white }]}>{ticket.venue}</ThemedText>
                  </View>
              </View>
            </View>

            <View style={styles.eventInfo} />

          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <ThemedText style={[styles.dateTimeText, { color: theme.textSecondary }]}>{ticket.date}</ThemedText>
            </View>

            <View style={[styles.dateTimeDivider, { backgroundColor: theme.border }]} />

            <View style={styles.dateTimeItem}>
              <ThemedText style={[styles.dateTimeText, { color: theme.textSecondary }]}>{ticket.time}</ThemedText>
            </View>
          </View>

          <View style={styles.dashedLineContainer}>
            <DashedLine width={width - Spacing.xl * 2} color={theme.border} />
          </View>

          <View style={styles.qrSection}>
            <QRCode value={ticket.ticketId} size={130} color={theme.text} backgroundColor={theme.white} />

            <ThemedText style={[styles.qrLabel, { color: theme.textSecondary }]}>Ticket ID</ThemedText>

            <ThemedText style={[styles.qrValue, { color: theme.text }]}>{ticket.ticketId}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ticketWrapper: { position: "relative", alignItems: "center" },
  shadowContainer: { position: "absolute", top: 12, left: 6 },
  shadowSvgContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  ticketContainer: { position: "relative", overflow: "hidden" },
  ticketContent: { position: "absolute", top: 0, left: 0, overflow: "hidden", borderRadius: CORNER_RADIUS },
  imageContainer: { width: "100%", height: 260, position: "relative" },
  eventImage: { width: "100%", height: "100%" },
  imageOverlay: { ...StyleSheet.absoluteFillObject },
  imageHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  eventTitleOverlay: { fontSize: 22, fontWeight: "700", marginBottom: Spacing.xs },
  venueTextOverlay: { fontSize: 14, opacity: 0.9 },
  venueRowOverlay: { flexDirection: "row", alignItems: "center" },
  eventInfo: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  eventTitle: { fontSize: 22, fontWeight: "700", marginBottom: Spacing.xs },
  venueRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  venueText: { fontSize: 14 },
  dateTimeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xs -20 },
  dateTimeItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateTimeDivider: { width: 1, height: 20, marginHorizontal: Spacing.lg },
  dateTimeText: { fontSize: 13 },
  dashedLineContainer: { alignItems: "center", paddingVertical: Spacing.md, width: "100%" },
  dashedLine: { alignSelf: "center" },
  qrSection: { alignItems: "center", paddingVertical: Spacing.lg, paddingBottom: Spacing.xl, gap: 10 },
  qrLabel: { fontSize: 12, marginTop: Spacing.md },
  qrValue: { fontSize: 17, fontWeight: "700" },
});
