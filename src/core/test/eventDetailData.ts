import { ImageSourcePropType } from "react-native";

export interface EventOrganizer {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
  followers: number;
  isFollowing: boolean;
}

export interface EventLocation {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface EventTicket {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: boolean;
  isSoldOut: boolean;
}

export interface EventSector {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  duration: string;
}

export interface EventDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  dayOfWeek: string;
  image: ImageSourcePropType;
  attendeesCount: number;
  organizer: EventOrganizer;
  location: EventLocation;
  tickets: EventTicket[];
  sectors: EventSector[];
  spotifyPlaylist: {
    embedUrl: string;
  };
  category: string;
  tags?: string[];
  googleMapsLink?: string;
}

import { TEST_DATABASE } from "@/src/core/test/testDatabase";

function formatSpanishDate(dt: Date) {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const day = dt.getDate().toString().padStart(2, "0");
  const monthName = months[dt.getMonth()];
  const year = dt.getFullYear();
  return `${day} de ${monthName}, ${year}`;
}

function formatSpanishTime(dt: Date) {
  const hours = dt.getHours();
  const minutes = dt.getMinutes().toString().padStart(2, "0");
  const suffix = hours >= 12 ? "pm" : "am";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes} ${suffix}`;
}

function dayOfWeekSpanish(dt: Date) {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dt.getDay()];
}

function toEmbedSpotify(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/embed/")) return url;
    const parts = u.pathname.split("/").filter(Boolean);
    const kind = parts[0];
    const id = parts[1];
    if (kind && id) {
      return `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator`;
    }
    return url;
  } catch {
    return url || "";
  }
}

function mapTestEventToDetailById(testEventId: number): EventDetail | null {
  const ev = TEST_DATABASE.events.find((e) => e.id === testEventId);
  if (!ev) return null;
  const organizer = TEST_DATABASE.organizadores.find((o) => o.id === ev.organizador_id);
  const place = TEST_DATABASE.lugares.find((l) => l.id === ev.lugar_id);
  const dt = new Date(ev.start_time);
  return {
    id: `evt_${ev.id}`,
    title: ev.titulo,
    subtitle: ev.subtitulo || "",
    description: ev.descripcion || "",
    date: formatSpanishDate(dt),
    time: formatSpanishTime(dt),
    dayOfWeek: dayOfWeekSpanish(dt),
    image: (ev.cover_url as ImageSourcePropType),
    attendeesCount: ev.attendeesCount || 0,
    organizer: {
      id: organizer?.id || 0,
      name: organizer?.nombre || "",
      avatar: (organizer?.logo_url as ImageSourcePropType) || require("@/src/core/assets/events/alice-park/profile.jpg"),
      followers: organizer?.followers || 0,
      isFollowing: false,
    },
    location: {
      id: place?.id || 0,
      name: place?.nombre || "",
      address: place?.direccion || "",
      latitude: place?.latitud || 0,
      longitude: place?.longitud || 0,
    },
    tickets: (ev.tickets || []).map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      currency: t.currency || "Bs.",
      available: t.available ?? true,
      isSoldOut: t.isSoldOut ?? false,
    })),
    sectors: [],
    spotifyPlaylist: { embedUrl: toEmbedSpotify((ev as any).spotifyPlaylistUrl || "") },
    category: "musica",
    tags: [],
    googleMapsLink: place ? `https://www.google.com/maps?q=${place.latitud},${place.longitud}` : "",
  };
}

export function getEventDetailById(eventId: string): EventDetail | null {
  // Map common IDs used in UI to the canonical TEST_DATABASE event id 901
  const croAliases = new Set(["1", "banner2", "featured-2", "cro-concierto-1", "cro", "cro-concierto"]);
  if (croAliases.has(eventId)) {
    return mapTestEventToDetailById(901);
  }
  // Known slugs used by cards mapped to TEST_DATABASE ids
  const SLUG_TO_ID: Record<string, number> = {
    cro: 901,
    "corona-lu": 902,
    lgante: 903,
    bresh: 904,
    "cumbia-inmersiva": 905,
    "modo-cumbia": 906,
    brlin: 907,
    reik: 908,
    "oktober-fest": 909,
    "pink-friday": 910,
    "el-circo": 911,
    fexco: 912,
    "doble-via": 913,
    levitar: 914,
    "noche-musica": 916,
    "its-britney": 917,
    "proyecto-n": 918,
    "show-wilson": 919,
    querencias: 920,
    "bolivia-200": 921,
    "palacio-suena": 922,
    litovchenko: 923,
    "hamilton-musical": 924,
  };
  const slugKey = eventId.toLowerCase();
  if (SLUG_TO_ID[slugKey]) {
    return mapTestEventToDetailById(SLUG_TO_ID[slugKey]);
  }
  // Attempt to parse numeric id directly
  const num = Number(eventId);
  if (!Number.isNaN(num)) {
    return mapTestEventToDetailById(num);
  }
  // Resolve by slug: compare normalized title to provided id
  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const match = TEST_DATABASE.events.find((e) => toSlug(e.titulo) === eventId.toLowerCase());
  if (match) {
    return mapTestEventToDetailById(match.id);
  }
  return null;
}

export interface EventFormImage {
  uri: string;
  width: number;
  height: number;
  offsetY: number;
}

export interface EventFormTicket {
  id: string;
  name: string;
  price: number; // numeric price, currency handled separately if needed
  currency?: string; // optional, default "Bs."
  stock?: number;
  isPaid?: boolean;
  available?: boolean;
}

export interface EventFormDataLite {
  id?: string;
  title: string;
  subtitle?: string;
  detailsHtml: string; // rich text HTML that may include age restriction/refund policy
  dateTime: Date; // single Date used to derive date, time, dayOfWeek
  eventImage?: EventFormImage | ImageSourcePropType | null;
  locationName: string;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
  tickets?: EventFormTicket[];
  spotifyPlaylist?: string; // raw URL; will be normalized to an embed url
  category?: string; // simple category string like "musica"
}

export interface OrganizerLite {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
  followers?: number;
  isFollowing?: boolean;
}
// Helpers already defined earlier in file; remove duplicate implementations

function parseLatLongFromGoogleMaps(url?: string): { lat?: number; lng?: number } {
  if (!url) return {};
  try {
    const u = new URL(url);
    // Pattern 1: .../@-17.37664,-66.14978,15z
    const at = u.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (at) {
      return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };
    }
    // Pattern 2: query params like ?q=-17.37664,-66.14978 or ?ll=-17.37664,-66.14978
    const qp = u.searchParams.get("q") || u.searchParams.get("ll");
    if (qp) {
      const m = qp.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    return {};
  } catch {
    return {};
  }
}

export function buildEventDetailFromForm(
  form: EventFormDataLite,
  organizer: OrganizerLite
): EventDetail {
  const dateStr = formatSpanishDate(form.dateTime);
  const timeStr = formatSpanishTime(form.dateTime);
  const dow = dayOfWeekSpanish(form.dateTime);

  const image: ImageSourcePropType | undefined = form.eventImage
    ? (typeof form.eventImage === "object" && "uri" in (form.eventImage as any)
        ? { uri: (form.eventImage as any).uri }
        : (form.eventImage as ImageSourcePropType))
    : undefined;

  const tickets: EventTicket[] = (form.tickets || []).map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    currency: t.currency || "Bs.",
    available: t.available ?? true,
    isSoldOut: t.available === false,
  }));

  const location: EventLocation = {
    id: Date.now(),
    name: form.locationName,
    address: form.locationAddress || "",
    latitude: (() => {
      if (typeof form.latitude === "number") return form.latitude;
      const parsed = parseLatLongFromGoogleMaps((form as any).googleMapsLink);
      return parsed.lat ?? 0;
    })(),
    longitude: (() => {
      if (typeof form.longitude === "number") return form.longitude;
      const parsed = parseLatLongFromGoogleMaps((form as any).googleMapsLink);
      return parsed.lng ?? 0;
    })(),
  };

  const organizerFull: EventOrganizer = {
    id: organizer.id,
    name: organizer.name,
    avatar: organizer.avatar,
    followers: organizer.followers ?? 0,
    isFollowing: organizer.isFollowing ?? false,
  };

  return {
    id: form.id || `${organizer.id}-${Date.now()}`,
    title: form.title,
    subtitle: form.subtitle || "",
    description: form.detailsHtml, // rich HTML from editor, includes age/refund if author adds it
    date: dateStr,
    time: timeStr,
    dayOfWeek: dow,
    image: image || require("@/src/modules/home/assets/cro-concierto.jpg"), // fallback
    attendeesCount: 0,
    organizer: organizerFull,
    location,
    tickets,
    sectors: [], // For now sectors map is an IMAGE in the UI; keep empty here
    spotifyPlaylist: { embedUrl: toEmbedSpotify(form.spotifyPlaylist) },
    category: form.category || "musica",
    tags: (form as any).tags || [],
    googleMapsLink: (form as any).googleMapsLink || "",
  };
}
