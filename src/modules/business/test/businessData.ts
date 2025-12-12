import { ImageSourcePropType } from "react-native";

export interface BusinessEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  image: ImageSourcePropType;
  location: string;
  totalSales: number;
  ticketsSold: number;
  status: "active" | "finished" | "upcoming";
  tags: string[];
  // Extended optional fields to persist preview data after publish
  descriptionHTML?: string;
  googleMapsLink?: string;
  spotifyUrl?: string;
  dayOfWeekLabel?: string;
  sectorImage?: ImageSourcePropType;
  startTimeIso?: string;
  latitude?: number;
  longitude?: number;
  tickets?: Array<{
    id: string;
    name: string;
    price: number;
    currency?: string;
    available?: boolean;
    isSoldOut?: boolean;
  }>;
}

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  price: number;
  fee: number;
  stock: number;
  soldCount: number;
  isFree: boolean;
  minPerPurchase: number;
  maxPerPurchase: number;
}

export interface SalesMetric {
  month: string;
  sales: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: ImageSourcePropType;
  rating: number;
  comment: string;
  date: string;
}

export const BUSINESS_ORGANIZER = {
  id: "org_001",
  name: "Alice Park",
  email: "contact@alicepark.com",
  bio: "Alice Park es la discoteca más grande y moderna de Bolivia, inaugurada en 2024 en Cochabamba con un show internacional de Lunay y respaldada por Amstel Beer.",
  logo: require("@/src/core/assets/events/alice-park/profile.jpg") as ImageSourcePropType,
  followers: 12756,
  following: 350,
  isPlus: false,
  socialLinks: [
    { type: "instagram", url: "https://instagram.com/alicepark" },
    { type: "facebook", url: "https://facebook.com/alicepark" },
    { type: "twitter", url: "https://twitter.com/alicepark" },
  ],
};

export const BUSINESS_EVENTS: BusinessEvent[] = [
  {
    id: "evt_001",
    title: "Noche de Museos",
    subtitle: "Una noche mágica",
    date: "01 DE MAYO",
    time: "9:00 PM",
    image: require("@/src/core/assets/events/alice-park/event1.png") as ImageSourcePropType,
    location: "Alice Park",
    totalSales: 12760.8,
    ticketsSold: 246,
    status: "active",
    tags: ["cultura", "arte", "musica"],
  },
  {
    id: "evt_002",
    title: "C.R.O en Concierto",
    subtitle: "World Tour 2025",
    date: "11 DE ABRIL",
    time: "10:00 PM",
    image: require("@/src/core/assets/events/alice-park/event6.jpg") as ImageSourcePropType,
    location: "Alice Park",
    totalSales: 23453.4,
    ticketsSold: 1342,
    status: "active",
    tags: ["conciertos", "musica"],
  },
  {
    id: "evt_003",
    title: "Corona & Lu de la Tower",
    subtitle: "After Bautizo",
    date: "26 DE ABRIL",
    time: "9:00 PM",
    image: require("@/src/core/assets/events/alice-park/event3.png") as ImageSourcePropType,
    location: "Alice Park",
    totalSales: 12487.5,
    ticketsSold: 560,
    status: "active",
    tags: ["fiesta", "musica"],
  },
];

export const BUSINESS_TICKETS: Ticket[] = [
  {
    id: "tkt_001",
    eventId: "evt_001",
    name: "ROCKSTAR",
    price: 100,
    fee: 5,
    stock: 500,
    soldCount: 150,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 5,
  },
  {
    id: "tkt_002",
    eventId: "evt_001",
    name: "CAMPO",
    price: 75,
    fee: 3.75,
    stock: 300,
    soldCount: 96,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 5,
  },
  {
    id: "tkt_003",
    eventId: "evt_002",
    name: "VIP",
    price: 250,
    fee: 12.5,
    stock: 100,
    soldCount: 95,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 4,
  },
  {
    id: "tkt_004",
    eventId: "evt_002",
    name: "GENERAL",
    price: 150,
    fee: 7.5,
    stock: 1500,
    soldCount: 1247,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 6,
  },
  {
    id: "tkt_005",
    eventId: "evt_003",
    name: "EARLY BIRD",
    price: 80,
    fee: 4,
    stock: 200,
    soldCount: 200,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 5,
  },
  {
    id: "tkt_006",
    eventId: "evt_003",
    name: "REGULAR",
    price: 100,
    fee: 5,
    stock: 600,
    soldCount: 360,
    isFree: false,
    minPerPurchase: 1,
    maxPerPurchase: 5,
  },
];

export const SALES_DATA_MONTHLY: SalesMetric[] = [
  { month: "Ene", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Abr", sales: 65000 },
  { month: "May", sales: 58000 },
  { month: "Jun", sales: 72000 },
  { month: "Jul", sales: 68000 },
  { month: "Ago", sales: 75000 },
  { month: "Sep", sales: 82000 },
  { month: "Oct", sales: 78000 },
  { month: "Nov", sales: 88000 },
  { month: "Dic", sales: 95000 },
];

export const BUSINESS_TEST_CREDENTIALS = {
  organizationName: "Alice Park",
  email: "alice@alicepark.com",
  username: "alicepark",
  password: "password123",
  verificationCode: "4821",
};
