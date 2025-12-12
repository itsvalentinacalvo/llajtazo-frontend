import React, { createContext, useContext, useState, ReactNode } from "react";
import { useProfile } from "@/src/core/context/ProfileContext";

export type PurchasedTicket = {
  ticketId: string;
  title: string;
  venue?: string;
  date?: string;
  time?: string;
  sector?: string;
  image?: any;
};

export type PurchasedGroup = {
  eventId: string;
  title: string;
  venue?: string;
  image?: any;
  tickets: PurchasedTicket[];
};

type TicketsContextType = {
  groups: PurchasedGroup[];
  addPurchase: (group: PurchasedGroup) => void;
  getByEventId: (eventId: string) => PurchasedGroup | undefined;
  clearAll: () => void;
};

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [mapState, setMapState] = useState<Map<string, PurchasedGroup>>(new Map());

  const { profile, updateProfile } = (() => {
    try {
      return useProfile();
    } catch (e) {
      // If ProfileProvider isn't present, return fallbacks so TicketsProvider still works
      return { profile: undefined as any, updateProfile: undefined as any } as any;
    }
  })();

  const addPurchase = (group: PurchasedGroup) => {
    // compute how many tickets will be added so we can update profile counts
    let addedCount = 0;

    setMapState((prev) => {
      const next = new Map(prev);
      const existing = next.get(group.eventId);
      // derive a base (everything except trailing -number) from incoming ticketId
      const deriveBase = (ticketId?: string) => {
        if (!ticketId) return String(group.eventId);
        // remove trailing -<number> (one or more digits)
        return String(ticketId).replace(/-\d+$/, "");
      };

      if (existing) {
        const existingCount = existing.tickets.length;
        const incomingBase = deriveBase(group.tickets && group.tickets[0] && group.tickets[0].ticketId);

        const renumbered = group.tickets.map((t, idx) => {
          const newId = `${incomingBase}-${existingCount + idx + 1}`;
          return { ...t, ticketId: String(newId) };
        });

        existing.tickets = existing.tickets.concat(renumbered);
        next.set(group.eventId, { ...existing });
        addedCount = renumbered.length;
      } else {
        const incomingBase = deriveBase(group.tickets && group.tickets[0] && group.tickets[0].ticketId);
        const renumbered = group.tickets.map((t, idx) => ({ ...t, ticketId: `${incomingBase}-${idx + 1}` }));
        next.set(group.eventId, { ...group, tickets: renumbered });
        addedCount = renumbered.length;
      }

      return next;
    });

    if (updateProfile && profile) {
      try {
        updateProfile({ stats: { ...profile.stats, tickets: (profile.stats?.tickets || 0) + addedCount } });
      } catch (e) {
        // Best-effort; ignore update failures
        // eslint-disable-next-line no-console
        console.debug("TicketsContext: failed updating profile stats", e);
      }
    }
  };

  const getByEventId = (eventId: string) => {
    return mapState.get(eventId);
  };

  const clearAll = () => setMapState(new Map());

  const groups = Array.from(mapState.values());

  return (
    <TicketsContext.Provider value={{ groups, addPurchase, getByEventId, clearAll }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error("useTickets must be used within TicketsProvider");
  return ctx;
}

export default TicketsContext;
