import React, { createContext, useContext, useState, ReactNode } from "react";

export type SavedEventMinimal = {
  id: string;
  title?: string;
  // dateTime is the final display string (e.g. "11 DE ABRIL - VIE - 9:00 PM")
  dateTime?: string;
  // optional raw/date parts that may be provided by different screens
  date?: any;
  time?: string;
  image?: any;
  backgroundColor?: string;
  location?: string;
  category?: string;
  isExpired?: boolean;
};

type SavedEventsContextType = {
  savedMap: Map<string, SavedEventMinimal>;
  toggleSaved: (event: SavedEventMinimal) => void;
  isSaved: (id: string) => boolean;
  getAll: () => SavedEventMinimal[];
};

const SavedEventsContext = createContext<SavedEventsContextType | undefined>(undefined);

export function SavedEventsProvider({ children }: { children: ReactNode }) {
  const [savedMapState, setSavedMapState] = useState<Map<string, SavedEventMinimal>>(new Map());

  const toggleSaved = (event: SavedEventMinimal) => {
    setSavedMapState((prev) => {
      const next = new Map(prev);
      if (next.has(event.id)) {
        next.delete(event.id);
        return next;
      }

      // Normalize and compute a display `dateTime` if not provided.
      const normalized: SavedEventMinimal = { ...event };

      if (!normalized.dateTime) {
        // Case: date is a plain string and time may exist
        if (normalized.date && typeof normalized.date === "string") {
          const dateStr = normalized.date.toString().toUpperCase();
          const timeStr = normalized.time ? normalized.time.toString().toUpperCase() : undefined;
          normalized.dateTime = timeStr ? `${dateStr} - ${timeStr}` : dateStr;
        }

        // Case: date is an object like { day, month, weekday }
        else if (normalized.date && typeof normalized.date === "object" && typeof normalized.date.day !== "undefined") {
          const day = normalized.date.day;
          const month = (normalized.date.month || "").toString().toUpperCase();
          const weekday = normalized.date.weekday ? ` - ${normalized.date.weekday.toString().toUpperCase()}` : "";
          const timePart = normalized.time ? ` - ${normalized.time.toString().toUpperCase()}` : "";
          normalized.dateTime = `${day} DE ${month}${weekday}${timePart}`;
        }

        // Fallback: if only time exists, use it
        else if (normalized.time) {
          normalized.dateTime = normalized.time.toString().toUpperCase();
        }
      }

      next.set(event.id, normalized);
      return next;
    });
  };

  const isSaved = (id: string) => savedMapState.has(id);

  const getAll = () => Array.from(savedMapState.values());

  return (
    <SavedEventsContext.Provider value={{ savedMap: savedMapState, toggleSaved, isSaved, getAll }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

export function useSavedEvents() {
  const ctx = useContext(SavedEventsContext);
  if (!ctx) throw new Error("useSavedEvents must be used within SavedEventsProvider");
  return ctx;
}

export default SavedEventsContext;
