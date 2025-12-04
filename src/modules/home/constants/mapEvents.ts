import { ImageSourcePropType } from "react-native";

export type EventCategory = "cultura" | "musica" | "ferias" | "arte";

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
};

export const MAP_EVENTS: MapEvent[] = [
  {
    id: "1",
    title: "C.R.O en Concierto",
    location: "Alice Park",
    date: "Mar, 11 de Abril",
    time: "9:00 PM",
    category: "musica",
    image: require("../assets/cro-concierto.jpg"),
    coordinate: {
      latitude: -17.376840542371554,
      longitude: -66.14984506062555,
    },
    isSaved: true,
  },
  {
    id: "2",
    title: "Noche de Jazz & Blues",
    location: "NOMA",
    date: "Vie, 14 de Abril",
    time: "8:30 PM",
    category: "musica",
    image: require("../assets/modo-cumbia.png"),
    coordinate: {
      latitude: -17.37555046769994,
      longitude: -66.14948750706401,
    },
  },
  {
    id: "3",
    title: "Oktoberfest Cochabamba",
    location: "Beertown",
    date: "Sab, 15 de Abril",
    time: "6:00 PM",
    category: "ferias",
    image: require("../assets/oktober-fest.png"),
    coordinate: {
      latitude: -17.37620972181715,
      longitude: -66.14992980847333,
    },
  },
  {
    id: "4",
    title: "Exposición de Arte Moderno",
    location: "Galería Centenario",
    date: "Vie, 21 de Abril",
    time: "7:00 PM",
    category: "arte",
    image: require("../assets/pink-friday.png"),
    coordinate: {
      latitude: -17.372599255409582,
      longitude: -66.14932669380501,
    },
  },
  {
    id: "5",
    title: "Festival Cultural Boliviano",
    location: "Plaza Principal",
    date: "Dom, 23 de Abril",
    time: "5:00 PM",
    category: "cultura",
    image: require("../assets/levitar.png"),
    coordinate: {
      latitude: -17.375874961937384,
      longitude: -66.14949387280934,
    },
  },
];
