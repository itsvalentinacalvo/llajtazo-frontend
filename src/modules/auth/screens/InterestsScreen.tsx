import { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//COMPONENTES GLOBALES DEL PROYECTO
import { ScreenScrollView } from "@/src/core/components/ScreenScrollView";
import { ThemedText } from "@/src/core/components/ThemedText";
import { Spacing, BorderRadius } from "@/src/core/constants/theme";

interface Interest {
  id: string;
  label: string;
  isSpecial?: boolean;
  isHidden?: boolean;
}

const interests: Interest[] = [
  { id: "teatro", label: "Teatro" },
  { id: "conciertos", label: "Conciertos" },
  { id: "musica", label: "Música" },
  { id: "baile", label: "Baile" },
  { id: "comedia", label: "Comedia" },
  { id: "arte", label: "Arte", isSpecial: true },
  { id: "cine", label: "Cine" },
  { id: "literatura", label: "Literatura" },
  { id: "festivales", label: "Festivales" },
  { id: "nightlife", label: "Nightlife" },
  { id: "aire-libre", label: "Actividades al aire libre" },
  { id: "ferias", label: "Ferias" },
  { id: "_spacer", label: "", isHidden: true },
  { id: "yoga", label: "Yoga" },
  { id: "deportes", label: "Deportes" },
  { id: "gastronomia", label: "Gastronomía" },
  { id: "meditacion", label: "Meditación" },
  { id: "comunidad", label: "Comunidad" },
  { id: "talleres", label: "Talleres" },
  { id: "conferencias", label: "Conferencias" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "familiar", label: "Familiar" },
  { id: "infantil", label: "Infantil" },
  { id: "comida-tipica", label: "Comida típica" },
  { id: "voluntariado", label: "Voluntariado" },
];

const initialSelected: string[] = [];

export default function InterestsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(initialSelected);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    navigation.navigate("MainApp", {
      screen: "Home",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: "#FFFFFF" }]}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Selecciona</ThemedText>
          <ThemedText style={styles.subtitle}>
            Algunas palabras clave que describan tus intereses
          </ThemedText>
        </View>

        <View style={styles.pillsContainer}>
          {interests.map((interest) => {
            if (interest.isHidden) {
              return (
                <View
                  key={interest.id}
                  style={{ width: "100%", height: 0, marginBottom: -17 }}
                />
              );
            }

            const isSelected = selectedInterests.includes(interest.id);

            return (
              <InterestPill
                key={interest.id}
                label={interest.label}
                isSelected={isSelected}
                isSpecial={interest.isSpecial}
                onPress={() => toggleInterest(interest.id)}
              />
            );
          })}
        </View>

        <View style={styles.buttonWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleContinue}
          >
            <ThemedText style={styles.continueButtonText}>FINALIZAR</ThemedText>
          </Pressable>
        </View>

        <View style={{ height: insets.bottom + Spacing.xl }} />
      </ScreenScrollView>
    </View>
  );
}

interface PillProps {
  label: string;
  isSelected: boolean;
  isSpecial?: boolean;
  onPress: () => void;
}

function InterestPill({
  label,
  isSelected,
  isSpecial,
  onPress,
}: PillProps) {
  const getBackgroundColor = () => {
    if (!isSelected) return "#FFFFFF";
    if (isSpecial) return "#2BBBFF";
    return "#2BBBFF";
  };

  const getTextColor = () => {
    if (isSelected) return "#FFFFFF";
    return "#2BBBFF";
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: isSelected ? getBackgroundColor() : "#2BBBFF",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText style={[styles.pillText, { color: getTextColor() }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl },

  header: {
    paddingTop: Spacing["5xl"] + 16,
    paddingBottom: Spacing["3xl"],
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 17,
    color: "#666666",
    lineHeight: 21,
  },

  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "stretch",
    marginTop: 20,
  },

  pill: {
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: "#2BBBFF",
    marginHorizontal: 11,
    marginBottom: 17,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },

  buttonWrapper: {
    paddingTop: Spacing["5xl"] + 95,
    paddingBottom: Spacing["3xl"],
  },

  continueButton: {
    backgroundColor: "#2BBBFF",
    borderRadius: BorderRadius.sm,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    alignSelf: "center",
    paddingHorizontal: 90,
    minWidth: 220,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});