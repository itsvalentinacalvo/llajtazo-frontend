import React, { createContext, useContext, useState, ReactNode } from "react";

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

  const addPurchase = (group: PurchasedGroup) => {
    setMapState((prev) => {
      const next = new Map(prev);
      const existing = next.get(group.eventId);
      if (existing) {
        // append tickets to existing group but renumber ticketIds so they remain sequential
        const existingCount = existing.tickets.length;
        // determine base prefix of incoming ticket ids (strip trailing -number if present)
        const incomingPrefix = (group.tickets && group.tickets[0] && group.tickets[0].ticketId)
          ? String(group.tickets[0].ticketId).split("-")[0]
          : group.eventId;

        const renumbered = group.tickets.map((t, idx) => {
          const newId = `${incomingPrefix}-${existingCount + idx + 1}`;
          return { ...t, ticketId: String(newId) };
        });

        existing.tickets = existing.tickets.concat(renumbered);
        next.set(group.eventId, { ...existing });
      } else {
        // first-time group: ensure ticketIds are normalized to prefix-1..N
        const incomingPrefix = (group.tickets && group.tickets[0] && group.tickets[0].ticketId)
          ? String(group.tickets[0].ticketId).split("-")[0]
          : group.eventId;

        const renumbered = group.tickets.map((t, idx) => ({ ...t, ticketId: `${incomingPrefix}-${idx + 1}` }));
        next.set(group.eventId, { ...group, tickets: renumbered });
      }
      return next;
    });
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
