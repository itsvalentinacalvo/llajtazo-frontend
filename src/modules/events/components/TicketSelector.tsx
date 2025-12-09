import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/src/core/components/ThemedText";
import { useTheme } from "@/src/core/hooks/useTheme";
import { Spacing } from "@/src/core/constants/theme";

interface Ticket {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: boolean;
  isSoldOut: boolean;
}

interface TicketSelectorProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
}

export function TicketSelector({
  tickets,
  selectedTicketId,
  onSelectTicket,
}: TicketSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {tickets.map((ticket) => {
        const isSelected = ticket.id === selectedTicketId;
        const isDisabled = ticket.isSoldOut || !ticket.available;
        let formattedPrice = ticket.price.toFixed(2);
        try {
          formattedPrice = new Intl.NumberFormat("es-BO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(ticket.price);
        } catch {
          // Leave the fallback toFixed formatting if Intl is unavailable.
        }

        return (
          <Pressable
            key={ticket.id}
            onPress={() => !isDisabled && onSelectTicket(ticket.id)}
            disabled={isDisabled}
            style={({ pressed }) => [
              styles.ticketRow,
              {
                backgroundColor: "#FFFFFF",
                borderColor: isSelected ? theme.primary : theme.border,
                borderWidth: isSelected ? 2 : 1,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={styles.ticketInfo}>
              <ThemedText
                style={[
                  styles.ticketName,
                  { color: isDisabled ? theme.textSecondary : theme.text },
                ]}
              >
                {ticket.name}
              </ThemedText>
              <View
                style={[
                  styles.priceTag,
                  {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.priceText,
                    {
                      color: isDisabled ? theme.textSecondary : isSelected ? theme.primary : theme.textSecondary,
                    },
                  ]}
                >
                  {ticket.currency} {formattedPrice}
                </ThemedText>
              </View>
            </View>

            <View style={styles.ticketStatus}>
              {ticket.isSoldOut ? (
                <View style={[styles.soldOutBadge, { backgroundColor: "#2BBBFF" }]}>
                  <ThemedText style={styles.soldOutText}>SOLD OUT</ThemedText>
                </View>
              ) : isSelected ? (
                <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                  <Feather name="check" size={16} color="#FFFFFF" />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  ticketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs * 0.5,
  },
  priceTag: {
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: 0,
    marginTop: Spacing.xs * 0.5,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
  },
  ticketStatus: {
    marginLeft: Spacing.md,
  },
  soldOutBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  soldOutText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
