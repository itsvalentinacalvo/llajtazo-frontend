import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import VisaSvg from "@/src/modules/payment/assets/VisaSvg";

import { ThemedText } from "@/src/core/components/ThemedText";
import { Button } from "@/src/core/components/Button";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/src/core/constants/theme";

export default function PaymentCardScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const route = useRoute();
  const totalParam = (route.params as any)?.total ?? 0;

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [exp, setExp] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = () => {
    // navigate to the payment error screen registered in the root navigator
    (navigation as any).navigate("Error");
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + Spacing.md, backgroundColor: theme.white },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name="arrow-left" size={22} color={theme.text} />
        </Pressable>

        <ThemedText style={[styles.headerTitle, { color: theme.text }]}>
          Tarjeta de debito/crédito
        </ThemedText>

        <Pressable style={styles.headerButton}>
          <Feather name="more-vertical" size={22} color={theme.text} />
        </Pressable>
      </View>

      {/* DESCRIPTION */}
      <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
        No olvides habilitar tu tarjeta para pagos por internet.
      </ThemedText>

      {/* CARD LOGOS */}
      <View style={styles.cardIconsRow}>
        {/* MASTERCARD */}
        <View style={styles.mastercardBox}>
          <View style={[styles.masterCircle, { backgroundColor: "#EB001B", left: 12, zIndex: 2 }]} />
          <View style={[styles.masterCircle, { backgroundColor: "#FFB84D", left: 24 }]} />
        </View>

        {/* VISA - blue rounded rect with white VISA icon */}
        <View style={styles.visaBox}>
          <VisaSvg width={60} height={36} />
        </View>

        
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>
        {/* NAME */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="user" size={20} color={theme.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Nombre del Titular"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* CARD NUMBER */}
        <View style={styles.inputWrapper}>
          <FontAwesome6 name="credit-card" size={20} color={theme.textSecondary} style={styles.inputIcon} />
          <TextInput
            placeholder="Número de Tarjeta"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            value={number}
            onChangeText={setNumber}
            keyboardType="numeric"
          />
        </View>

        {/* CVV + EXP */}
        <View style={styles.row}>
          <View style={[styles.smallInputWrapper, { marginRight: Spacing.md }]}>
            <FontAwesome6 name="unlock-keyhole" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="CVV"
              placeholderTextColor={theme.textSecondary}
              style={[styles.smallInput, { color: theme.text }]}
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.smallInputWrapper}>
            <FontAwesome6 name="calendar" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              placeholder="MM/YYYY"
              placeholderTextColor={theme.textSecondary}
              style={[styles.smallInput, { color: theme.text }]}
              value={exp}
              onChangeText={setExp}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* GUARDAR TARJETA - colocada debajo de los textfields */}
        <Pressable style={styles.checkboxRow} onPress={() => setSaveCard((s) => !s)}>
          <View style={[styles.checkboxBox, saveCard && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
            {saveCard && <FontAwesome6 name="check" size={12} color="#FFFFFF" />}
          </View>
          <ThemedText style={[styles.subtitle, { color: saveCard ? theme.text : theme.textSecondary, marginBottom: 0 }]}>
            Guardar esta tarjeta
          </ThemedText>
        </Pressable>
      </View>

      {/* BUTTON */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.xl }]}> 
        <View style={styles.bottomTotalRow}>
          <ThemedText style={styles.bottomTotalLabel}>Total:</ThemedText>
          <ThemedText style={styles.bottomTotalValue}>{`Bs. ${Number(totalParam).toFixed(2).replace('.', ',')}`}</ThemedText>
        </View>

        <Button onPress={handleSubmit} style={styles.payButton} textStyle={styles.payText}>
          PROCESAR PAGO
        </Button>
      </View>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 22,
    fontWeight: "600",
  },

  subtitle: {
    textAlign: "left",
    fontSize: 16,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignSelf: "stretch",
  },

  /* CARD ICONS ROW */
  cardIconsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
  },

  mastercardBox: {
    width: 60,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },

  masterCircle: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 6,
  },

  visaBox: {
    width: 60,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },

  /* FORM */
  formContainer: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.white,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    height: 55,
  },

  inputIcon: {
    marginRight: Spacing.md,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.white,
    flex: 1,
    height: 55,
    paddingHorizontal: Spacing.md,
  },

  smallInput: {
    flex: 1,
    fontSize: 16,
  },

  /* BOTTOM BUTTON */
  bottomButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.light.white,
  },

  payButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },

  payText: {
    fontSize: 15,
    fontWeight: "700",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    paddingLeft: Spacing.sm - 6,
    paddingHorizontal: 0,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  bottomTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: Spacing.xs,
    paddingRight: 0,
    marginBottom: Spacing.md,
  },
  bottomTotalLabel: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginRight: Spacing.sm,
  },
  bottomTotalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
