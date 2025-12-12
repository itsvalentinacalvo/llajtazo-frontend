import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/src/core/components/ThemedText";
import { Button } from "@/src/core/components/Button";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, BorderRadius, Colors, Typography } from "@/src/core/constants/theme";
import DescargarQr from "@/src/modules/payment/components/DescargarQr";

export default function PaymentQrSimpleScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ QrSimple: { total?: number } }, "QrSimple">>();

  // accept forwarded params
  const total = route.params?.total ?? 0;
  const ticketCount = Number((route.params as any)?.ticketCount) || 1;
  const subtotal = Number((route.params as any)?.subtotal) || 0;
  const serviceFee = Number((route.params as any)?.serviceFee) || 0;
  const selectedTicketId = (route.params as any)?.selectedTicketId;
  const eventId = (route.params as any)?.eventId;
  const methodId = (route.params as any)?.methodId;
  const eventTitle = (route.params as any)?.eventTitle;
  const eventVenue = (route.params as any)?.eventVenue;
  const eventDate = (route.params as any)?.eventDate;
  const eventTime = (route.params as any)?.eventTime;
  const eventImage = (route.params as any)?.eventImage;

  // === TIMER 10:00 ===
  const [timeLeft, setTimeLeft] = useState(600); // 10 min
  const [qrDownloaded, setQrDownloaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDownload = () => {
    console.log("DESCARGAR QR");
    // future: implement file system save
    setQrDownloaded(true);
  };

  const handlePaymentDone = () => {
    console.log("Usuario indica que ya realizó el pago");
    // Navigate to the payment success screen in the payment stack
    (navigation as any).navigate("Success", {
      ticketCount,
      selectedTicketId,
      subtotal,
      serviceFee,
      total,
      eventId,
      methodId,
      eventTitle,
      eventVenue,
      eventDate,
      eventTime,
      eventImage,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.md }]}>
      {/* === HEADER === */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText style={[styles.headerTitle, { color: theme.text }]}> 
          Transferencia QR Simple
        </ThemedText>

        <Pressable style={styles.headerButton}>
          <Feather name="more-vertical" size={22} color={theme.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* DESCRIPTION */}
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          Escanea, saca un screenshot o descarga el código QR para realizar el pago correspondiente
        </ThemedText>

        {/* QR CODE */}
        <View style={styles.qrContainer}>
          <QRCode
            value="https://pago-qr-simple.com/123456"
            size={220}
            backgroundColor={theme.white}
            color={theme.text}
          />
        </View>

        {/* AMOUNT + DATE */}
        <ThemedText style={[styles.qrDetails, { color: theme.textSecondary }]}>
          {`${total} BOB          VENCE 25/12/25 23:59`}
        </ThemedText>

        {/* DOWNLOAD BUTTON */}
        <DescargarQr onPress={handleDownload} />

        {/* TIMER */}
        <View style={styles.timerRow}>
          <ThemedText style={[styles.timerLabel, { color: theme.textSecondary }]}>
            Tiempo restante
          </ThemedText>

          <ThemedText style={[styles.timerValue, { color: theme.primary }]}>
            {formatTime()}
          </ThemedText>
        </View>
      </View>
      
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.lg }]}> 
        <Button disabled={!qrDownloaded} onPress={handlePaymentDone} style={styles.selectButton} textStyle={styles.selectButtonText}>
          YA REALICE MI PAGO
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
    paddingHorizontal: Spacing.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  /* CONTENT */
  content: {
    alignItems: "center",
    width: "100%",
  },

  description: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.md,
    alignSelf: "stretch",
  },

  qrContainer: {
    padding: 16,
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    elevation: 5,
  },

  qrDetails: {
    fontSize: 12,
    marginBottom: Spacing["2xl"],
  },

  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing["2xl"],
  },

  timerLabel: {
    fontSize: 14,
  },

  timerValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.light.backgroundRoot,
    alignItems: "center",
  },
  selectButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  selectButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
