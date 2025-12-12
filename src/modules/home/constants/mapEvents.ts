import { ImageSourcePropType } from "react-native";

export type EventCategory = "cultura" | "musica" | "ferias" | "arte" | "danza";

export interface MapEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  category: EventCategory;
  image: ImageSourcePropType;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  isSaved?: boolean;
  // Optional link to the canonical event id defined in `EVENTS_MASTER`
  eventId?: string;
}

export const COCHABAMBA_REGION = {
  latitude: -17.3752,
  longitude: -66.1495,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const CATEGORY_CONFIG: Record<
  EventCategory,
  {
    color: string;
    icon: string | ImageSourcePropType;
    iconLibrary: "feather" | "material" | "ionicons" | "fontawesome" | "image";
    label: string;
  }
> = {
  cultura: {
    color: "#FF6B6B",
    icon: require("@/src/core/assets/sombrero-cholita.png"),
    iconLibrary: "image",
    label: "Cultura",
  },
  musica: {
    color: "#FFA85C",
    icon: "music",
    iconLibrary: "material",
    label: "Música",
  },
  ferias: {
    color: "#5DD9A4",
    icon: "bag",
    iconLibrary: "ionicons",
    label: "Ferias",
  },
  arte: {
    color: "#9B59B6",
    icon: "paint-brush",
    iconLibrary: "fontawesome",
    label: "Arte",
  },
  danza: {
    color: "#00BFFF",
    icon: "shoe-ballet",
    iconLibrary: "material",
    label: "Danza",
  },
};


import { EVENTS_MASTER } from "@/src/core/test/events";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";

// Helper to map categoria_id to EventCategory string
function getCategoryFromId(id?: number): EventCategory {
  switch (id) {
    case 1: return "cultura";
    case 2: return "musica";
    case 3: return "ferias";
    case 4: return "arte";
    case 5: return "danza";
    default: return "musica";
  }
}

function normalize(s?: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function formatDateString(startIso?: string): string {
  if (!startIso) return "";
  const dt = new Date(startIso);
  const day = dt.toLocaleDateString("es-ES", { weekday: "short" });
  const dayNum = dt.getDate().toString().padStart(2, "0");
  const month = dt.toLocaleDateString("es-ES", { month: "long" });
  // e.g., "vie, 11 de abril" (capitalization handled by UI in some places)
  return `${day}, ${dayNum} de ${month}`;
}

function formatTimeString(startIso?: string): string {
  if (!startIso) return "";
  const dt = new Date(startIso);
  return dt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

// Build MAP_EVENTS from TEST_DATABASE canonical events, enriching with coordinates
export const MAP_EVENTS: MapEvent[] = EVENTS_MASTER.map((ev) => {
  // Find the raw DB event by id or slug for robust matching
  const raw = (TEST_DATABASE.events || []).find((e) => e.id === Number(ev.id) || e.slug === ev.id);
  const lugar = raw ? (TEST_DATABASE.lugares || []).find((l) => l.id === raw.lugar_id) : undefined;
  const latitude = (lugar as any)?.latitud ?? 0;
  const longitude = (lugar as any)?.longitud ?? 0;
  const startIso = raw?.start_time as string | undefined;
  const dateStr = formatDateString(startIso);
  const timeStr = formatTimeString(startIso);

  // Fallback to an existing local asset if the DB image is missing
  const image = ev.image ?? require("../assets/levitar.png");

  const category: EventCategory = getCategoryFromId(raw?.categoria_id);

  return {
    id: ev.id,
    title: ev.title,
    location: ev.location || lugar?.nombre || "",
    date: dateStr,
    time: timeStr,
    category,
    image,
    coordinate: { latitude, longitude },
    isSaved: false,
    eventId: ev.id,
  } as MapEvent;
}).filter((m) => !!m.location);
