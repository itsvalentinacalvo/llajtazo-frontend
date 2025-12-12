import { ImageSourcePropType } from "react-native";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";
import { formatSpanishDate, formatSpanishTime, dayOfWeekSpanish, badgePartsFromDate, parseIsoToDate } from "@/src/core/utils/date";
import type { BusinessEvent } from "@/src/modules/business/test/businessData";

type TestEvent = (typeof TEST_DATABASE)["events"][number];
type TestOrganizer = (typeof TEST_DATABASE)["organizadores"][number];
type TestPlace = (typeof TEST_DATABASE)["lugares"][number];

export function mapTestEventToBusinessEvent(e: TestEvent): BusinessEvent {
  const dt = parseIsoToDate(e.start_time);
  const { day, monthAbbr } = badgePartsFromDate(dt);
  const organizer = TEST_DATABASE.organizadores.find((o) => o.id === e.organizador_id) as TestOrganizer | undefined;
  const place = TEST_DATABASE.lugares.find((l) => l.id === e.lugar_id) as TestPlace | undefined;
  const image: ImageSourcePropType = e.cover_url as ImageSourcePropType;

  const normalizeSpotifyToEmbed = (url?: string): string => {
    if (!url) return "";
    try {
      // Already an embed URL
      if (url.includes("/embed/")) return url;
      // Convert open.spotify.com/{type}/{id} to embed
      const m = url.match(/open\.spotify\.com\/(playlist|track)\/([A-Za-z0-9]+)(.*)?/);
      if (m) {
        const type = m[1];
        const id = m[2];
        const rest = m[3] || ""; // preserve query params
        return `https://open.spotify.com/embed/${type}/${id}${rest}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  return {
    id: `evt_${e.id}`,
    title: e.titulo,
    subtitle: e.subtitulo || "",
    date: `${day} ${monthAbbr}`,
    time: formatSpanishTime(dt).toUpperCase(),
    image,
    location: place?.nombre || "",
    totalSales: 0,
    ticketsSold: 0,
    status: "active",
    tags: [],
    descriptionHTML: e.descripcion || "",
    googleMapsLink: place ? `https://www.google.com/maps?q=${place.latitud},${place.longitud}` : "",
    spotifyUrl: normalizeSpotifyToEmbed((e as any).spotifyPlaylistUrl || ""),
    dayOfWeekLabel: dayOfWeekSpanish(dt),
    sectorImage: (e as any).sectorImageUrl ? ((e as any).sectorImageUrl as ImageSourcePropType) : undefined,
    startTimeIso: e.start_time,
    tickets: (e.tickets || []).map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      currency: t.currency || "Bs.",
      available: t.available,
      isSoldOut: t.isSoldOut,
    })),
  };
}

export function getAllBusinessEventsFromTests(): BusinessEvent[] {
  return TEST_DATABASE.events.map(mapTestEventToBusinessEvent);
}