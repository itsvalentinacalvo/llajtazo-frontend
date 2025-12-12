import { ImageSourcePropType } from "react-native";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";

export interface AppEvent {
  id: string; // slug identifier
  title: string;
  subtitle?: string;
  category?: string[];
  date?: { day: string; month: string };
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

function monthAbbrevEs(mIdx: number): string {
  const abbr = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"] as const;
  return abbr[mIdx] || "";
}

function normalizeSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Hand-tuned mapping from TEST_DATABASE numeric ids to expected slugs
// Keep slugs stable across UI while sourcing from canonical numeric ids
const ID_TO_SLUG: Record<number, string> = {
  901: "cro",
  902: "corona-lu",
  903: "lgante",
  904: "bresh",
  905: "cumbia-inmersiva",
  906: "modo-cumbia",
  907: "brlin",
  908: "reik",
  909: "oktober-fest",
  910: "pink-friday",
  911: "el-circo",
  912: "fexco",
  913: "doble-via",
  914: "levitar",
  916: "noche-musica",
  917: "its-britney",
  918: "proyecto-n",
  919: "show-wilson",
  920: "querencias",
  921: "bolivia-200",
  922: "palacio-suena",
  923: "litovchenko",
  924: "hamilton-musical",
};

function toAppEvent(eventId: number): AppEvent | undefined {
  const ev = TEST_DATABASE.events.find((e) => e.id === eventId);
  if (!ev) return undefined;
  const dt = new Date(ev.start_time);
  const day = dt.getDate().toString().padStart(2, "0");
  const month = monthAbbrevEs(dt.getMonth());
  const lugar = TEST_DATABASE.lugares.find((l) => l.id === ev.lugar_id);
  const dbSlug = (ev as any).slug as string | undefined;
  const slug = dbSlug || ID_TO_SLUG[ev.id] || normalizeSlug(ev.titulo);
  return {
    id: slug,
    title: ev.titulo,
    subtitle: ev.subtitulo || "",
    category: [],
    date: { day, month },
    location: lugar?.nombre || "",
    attendees: ev.attendeesCount || 0,
    image: ev.cover_url as ImageSourcePropType,
  };
}

function eventsFromIds(ids: ReadonlyArray<number>) {
  return ids.map((id) => toAppEvent(id)).filter(Boolean) as AppEvent[];
}

// Build canonical list from all TEST_DATABASE events (mapped to cards)
let _EVENTS_MASTER = (TEST_DATABASE.events || [])
  .map((e) => toAppEvent(e.id))
  .filter(Boolean) as AppEvent[];
// Ensure unique slugs/ids to avoid duplicate key warnings in lists
const seen = new Map<string, number>();
_EVENTS_MASTER = _EVENTS_MASTER.map((ev) => {
  const count = seen.get(ev.id) || 0;
  seen.set(ev.id, count + 1);
  if (count > 0) {
    return { ...ev, id: `${ev.id}-${count}` };
  }
  return ev;
});
export const EVENTS_MASTER: AppEvent[] = _EVENTS_MASTER;

// Basic validation to catch data drift early
function validateTestData() {
  try {
    const ids = new Set<number>();
    const all = TEST_DATABASE.events || [];
    for (const e of all) {
      if (ids.has(e.id)) {
        console.warn(`[TEST_DATABASE] Duplicate event id detected: ${e.id}`);
      }
      ids.add(e.id);
    }
    const curated = TEST_DATABASE.curated || ({} as any);
    const sections = [
      ["featured", curated.featured as ReadonlyArray<number>],
      ["popular", curated.popular as ReadonlyArray<number>],
      ["nearby", curated.nearby as ReadonlyArray<number>],
      ["forYou", curated.forYou as ReadonlyArray<number>],
      ["banner", curated.banner as ReadonlyArray<number>],
      ["normal", curated.normal as ReadonlyArray<number>],
      ["sponsored", curated.sponsored as ReadonlyArray<number>],
    ].filter((x): x is [string, ReadonlyArray<number>] => Array.isArray(x[1]));
    for (const [name, arr] of sections) {
      const seen = new Set<number>();
      for (const id of arr) {
        if (!ids.has(id)) {
          console.warn(`[TEST_DATABASE] Curated '${name}' references missing id: ${id}`);
        }
        if (seen.has(id)) {
          console.warn(`[TEST_DATABASE] Curated '${name}' contains duplicate id: ${id}`);
        }
        seen.add(id);
      }
    }
    // Check slug uniqueness in mapped master list
    const slugs = new Set<string>();
    for (const ev of EVENTS_MASTER) {
      if (slugs.has(ev.id)) {
        console.warn(`[EVENTS_MASTER] Duplicate slug detected: ${ev.id}`);
      }
      slugs.add(ev.id);
    }
  } catch (err) {
    console.warn(`[events.ts] Validation error`, err);
  }
}

validateTestData();

// Helper: find canonical event by slug id
export function findEventById(id: string): AppEvent | undefined {
  return EVENTS_MASTER.find((e) => e.id === id);
}

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

// Curated sections sourced directly from TEST_DATABASE
export const FEATURED_EVENTS = eventsFromIds(TEST_DATABASE.curated.featured);
export const POPULAR_EVENTS = eventsFromIds(TEST_DATABASE.curated.popular);
export const NEARBY_EVENTS = eventsFromIds(TEST_DATABASE.curated.nearby);
export const FOR_YOU_EVENTS = eventsFromIds(TEST_DATABASE.curated.forYou);
export const BANNER_EVENTS = eventsFromIds(TEST_DATABASE.curated.banner);
export const NORMAL_EVENTS = eventsFromIds(TEST_DATABASE.curated.normal);
export const SPONSORED_EVENTS = eventsFromIds(TEST_DATABASE.curated.sponsored);

export const CANONICAL_EVENTS = EVENTS_MASTER;
