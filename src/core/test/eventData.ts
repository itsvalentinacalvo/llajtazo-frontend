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
  ageRestriction: string;
  refundPolicy: string;
  organizer: EventOrganizer;
  location: EventLocation;
  tickets: EventTicket[];
  sectors: EventSector[];
  spotifyPlaylist: {
    embedUrl: string;
  };
  category: string;
}

export const CRO_EVENT_DETAIL: EventDetail = {
  id: "cro-concierto-1",
  title: "C.R.O en concierto",
  subtitle: "",
  description: "C.R.O llega a Cochabamba! El principe de la movida aterriza en Alice Park para una noche epica. Preparate para vibrar con los hits que revolucionaron la escena del trap latino.",
  date: "11 de Abril, 2025",
  time: "9:00 pm",
  dayOfWeek: "Viernes",
  image: require("@/src/modules/home/assets/cro-concierto.jpg"),
  attendeesCount: 200,
  ageRestriction: "Este es un evento +18",
  refundPolicy: "Los participantes que no cumplan con la edad minima no seran elegibles para reembolsos",
  organizer: {
    id: 502,
    name: "Alice Park",
    avatar: require("@/src/core/assets/events/alice-park/profile.jpg"),
    followers: 9800,
    isFollowing: false,
  },
  location: {
    id: 701,
    name: "Alice Park",
    address: "Av. Melchor Urquidi, Cochabamba",
    latitude: -17.376642360467393,
    longitude: -66.14978895823978,
  },
  tickets: [
    {
      id: "ticket-rockstar",
      name: "ROCKSTAR",
      price: 150,
      currency: "Bs.",
      available: false,
      isSoldOut: true,
    },
    {
      id: "ticket-campo",
      name: "CAMPO",
      price: 200,
      currency: "Bs.",
      available: true,
      isSoldOut: false,
    },
    {
      id: "ticket-terraza",
      name: "TERRAZA",
      price: 250,
      currency: "Bs.",
      available: true,
      isSoldOut: false,
    },
  ],
  sectors: [
    { id: "sector-escenario", name: "ESCENARIO", color: "#1DA8E6", textColor: "#FFFFFF" },
    { id: "sector-rockstar", name: "ROCKSTAR", color: "#FF6B6B", textColor: "#FFFFFF" },
    { id: "sector-campo", name: "CAMPO", color: "#FFB84D", textColor: "#1A1A1A" },
    { id: "sector-terraza", name: "TERRAZA", color: "#5DD9A4", textColor: "#1A1A1A" },
  ],
  spotifyPlaylist: {
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1E4ovNoe2bZiyz?utm_source=generator",
  },
  category: "musica",
};

export function getEventDetailById(eventId: string): EventDetail | null {
  const eventMappings: Record<string, EventDetail> = {
    "1": CRO_EVENT_DETAIL,
    "banner2": CRO_EVENT_DETAIL,
    "featured-2": CRO_EVENT_DETAIL,
    "cro-concierto-1": CRO_EVENT_DETAIL,
  };
  
  return eventMappings[eventId] || null;
}
