import { MapEvent } from "../../constants/mapEvents";

export interface MapContainerRef {
  animateToEvent: (event: MapEvent) => void;
}

export interface MapContainerProps {
  events: MapEvent[];
  selectedEventId?: string;
  selectedCategory?: string;
  onSelectEvent: (event: MapEvent) => void;
}
