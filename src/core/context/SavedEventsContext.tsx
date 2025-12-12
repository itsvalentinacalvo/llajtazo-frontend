import React, { createContext, useContext, useState, ReactNode } from "react";
import { findEventById, findCanonicalEvent } from "@/src/core/data/events";

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
  subtitle?: string;
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
      // determine a canonical id to use as the map key. Prefer exact id,
      // then try to match a canonical event by title/location or other heuristics.
      const canonical = findEventById(event.id) || findCanonicalEvent(event as any);
      const key = (canonical && canonical.id) || event.id;

      if (next.has(key)) {
        next.delete(key);
        return next;
      }

      // If a master event exists in central data, prefer its canonical fields
      const master = canonical || findEventById(event.id);
      const normalized: SavedEventMinimal = { ...(master as any || {}), ...event };

      // Normalize and compute a display `dateTime` if not provided (master may supply date/time)

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

      next.set(key, normalized);
      return next;
    });
  };

  const isSaved = (id: string) => {
    if (savedMapState.has(id)) return true;

    // If the id corresponds to a canonical event in central data,
    // check if any saved entry matches that canonical event (by id or by title/location).
    const master = findEventById(id);
    if (master) {
      if (savedMapState.has(master.id)) return true;
      for (const v of savedMapState.values()) {
        if (v.title && v.location && v.title === master.title && v.location === master.location) return true;
      }
    }

    // As a final fallback, check if any saved event matches the same title/location
    for (const v of savedMapState.values()) {
      // if the provided id corresponds to an in-memory saved item key that isn't canonical,
      // we already returned true above. Without other context (title/location) we can't do more.
      // This loop will still catch cases where multiple different ids share the same title/location.
      if (!master && v.id === id) return true;
    }

    return false;
  };

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
