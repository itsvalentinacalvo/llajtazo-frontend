export interface Ticket {
  id: string;
  name: string;
  price: number;
  fee: number;
  stock: number;
  isPaid: boolean;
  minPerPurchase: number;
  maxPerPurchase: number;
}

export interface EventImageData {
  uri: string;
  width: number;
  height: number;
  offsetY: number;
}

export interface EventFormData {
  eventImage: EventImageData | null;
  title: string;
  subtitle: string;
  details: string;
  tags: string[];
  dateTime: Date;
  locationName: string;
  googleMapsLink: string;
  latitude?: number;
  longitude?: number;
  mapImage: string | null;
  tickets: Ticket[];
  spotifyUrl: string;
  youtubeVideo: string;
}
