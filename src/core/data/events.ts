import { ImageSourcePropType } from "react-native";

export interface AppEvent {
  id: string;
  title: string;
  subtitle?: string;
  category?: string[];
  date?: any;
  dateString?: string;
  location?: string;
  attendees?: number;
  image?: ImageSourcePropType;
  time?: string;
  sponsor?: {
    name: string;
    avatar: ImageSourcePropType;
  };
}

// Canonical master list: each event defined exactly once here.
export const EVENTS_MASTER: AppEvent[] = [
  {
    id: "cro",
    title: "C.R.O en Concierto",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "11", month: "ABR" },
    location: "Alice Park",
    attendees: 200,
    image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  },

  {
    id: "modo-cumbia",
    title: "Modo Cumbia",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "28", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/modo-cumbia.png"),
  },

  {
    id: "brlin",
    title: "B-RLIN en Concierto",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "05", month: "OCT" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/brlin.png"),
  },

  {
    id: "reik",
    title: "Reik en Concierto",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "06", month: "JUN" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/reik.png"),
  },

  {
    id: "oktober-fest",
    title: "Oktober Fest",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "25", month: "NOV" },
    location: "Euphoria",
    image: require("@/src/modules/home/assets/oktober-fest.png"),
  },

  {
    id: "pink-friday",
    title: "Pink Friday",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "03", month: "DIC" },
    location: "NOMA",
    image: require("@/src/modules/home/assets/pink-friday.png"),
  },

  {
    id: "el-circo",
    title: "El Circo - Capítulo Final",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "23", month: "AGO" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/circo-capitulo-final.jpg"),
  },

  {
    id: "fexco",
    title: "Fexco Negocios",
    subtitle: "",
    category: ["Conferencias"],
    date: { day: "20", month: "NOV" },
    location: "Centro de Eventos",
    image: require("@/src/modules/home/assets/fexco.jpg"),
  },

  {
    id: "doble-via",
    title: "Doble Vía en Vivo",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "29", month: "NOV" },
    location: "Alice Park",
    image: require("@/src/modules/home/assets/doble-via.png"),
  },

  {
    id: "levitar",
    title: "Levitar Night",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "30", month: "NOV" },
    location: "Levitar",
    image: require("@/src/modules/home/assets/levitar.png"),
  },

  {
    id: "corona-lu",
    title: "Corona y Lu de la Tower",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    location: "Alice Park",
    image: require("@/src/modules/home/assets/corona-lu-tower.jpg"),
  },

  {
    id: "noche-musica",
    title: "Noche de Música",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "30", month: "SEP" },
    location: "Radius Gallery",
    attendees: 150,
    image: require("@/src/modules/home/assets/levitar.png"),
  },

  {
    id: "noche-branca",
    title: "Noche BRANCA",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "22", month: "DIC" },
    location: "Aura",
    image: require("@/src/modules/home/assets/doble-via.png"),
  },

  {
    id: "noche-latina",
    title: "Noche Latina",
    subtitle: "",
    category: ["Nightlife", "Conciertos"],
    date: { day: "26", month: "MAR" },
    location: "NOMA",
    image: require("@/src/modules/home/assets/pink-friday.png"),
  },
];

// Helper: find canonical event by id
export function findEventById(id: string): AppEvent | undefined {
  return EVENTS_MASTER.find((e) => e.id === id);
}

// Attempt to locate a canonical event given partial data (title, id, etc.).
// Normalizes titles (letters+numbers only, lowercased) to match variants.
export function findCanonicalEvent(match: Partial<AppEvent> | undefined): AppEvent | undefined {
  if (!match) return undefined;

  if (match.id) {
    const byId = findEventById(match.id);
    if (byId) return byId;
  }

  const normalize = (s?: string) => (s || "").toString().toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
  const titleNorm = normalize(match.title);
  if (titleNorm) {
    return EVENTS_MASTER.find((e) => normalize(e.title) === titleNorm);
  }

  return undefined;
}

// Convenience: build category arrays referencing the canonical objects so existing
// code that expects `AppEvent[]` can continue to work while the app migrates
// cards to receive only `id` props.
function eventsFromIds(ids: string[]) {
  return ids.map((id) => findEventById(id)).filter(Boolean) as AppEvent[];
}

export const FEATURED_EVENTS = eventsFromIds(["corona-lu", "cro", "el-circo"]);
export const POPULAR_EVENTS = eventsFromIds(["cro", "noche-musica", "doble-via"]);
export const NEARBY_EVENTS = eventsFromIds(["el-circo", "noche-musica", "fexco"]);
export const FOR_YOU_EVENTS = eventsFromIds(["cro", "modo-cumbia", "brlin", "reik", "oktober-fest", "pink-friday"]);
export const BANNER_EVENTS = eventsFromIds(["corona-lu", "cro"]);
export const NORMAL_EVENTS = eventsFromIds(["cro", "corona-lu", "brlin", "reik", "modo-cumbia", "fexco", "levitar", "el-circo", "noche-branca", "noche-latina"]);
export const SPONSORED_EVENTS = eventsFromIds(["oktober-fest", "pink-friday", "modo-cumbia", "levitar"]);

// Export a single canonical list too.
export const CANONICAL_EVENTS = EVENTS_MASTER;
