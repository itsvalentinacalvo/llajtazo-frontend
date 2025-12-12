import { ImageSourcePropType } from "react-native";
import { PRIMARY_TEST_USER, TEST_DATABASE } from "@/src/core/test/testDatabase";

export type NotificationType =
  | "ticket_available"
  | "new_event"
  | "opinion_request"
  | "event_update"
  | "sold_out"
  | "tickets_low"
  | "event_reminder"
  | "favorite_event_update";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  image: ImageSourcePropType;
  title: string;
  message: string;
  timeAgo: string;
  highlightedText?: string;
  rating?: number;
  eventId?: string;
  eventName?: string;
}

type RawNotification = (typeof TEST_DATABASE.notificaciones)[number];

const NOTIFICATION_TYPE_MAP: Record<string, NotificationType> = {
  EVENT_REMINDER: "event_reminder",
  FAVORITE_EVENT_UPDATE: "favorite_event_update",
};

const KNOWN_TYPES: Set<NotificationType> = new Set([
  "ticket_available",
  "new_event",
  "opinion_request",
  "event_update",
  "sold_out",
  "tickets_low",
  "event_reminder",
  "favorite_event_update",
]);

const normalizeNotificationType = (type: RawNotification["tipo"]): NotificationType => {
  const upperType = type.toUpperCase();
  if (upperType in NOTIFICATION_TYPE_MAP) {
    return NOTIFICATION_TYPE_MAP[upperType];
  }

  const lowerType = type.toLowerCase() as NotificationType;
  if (KNOWN_TYPES.has(lowerType)) {
    return lowerType;
  }

  return "event_update";
};

const formatRelativeTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes <= 0) {
    return "Hace instantes";
  }

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Hace ${diffHours} hr${diffHours === 1 ? "" : "s"}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `Hace ${diffDays} dia${diffDays === 1 ? "" : "s"}`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  return `Hace ${diffWeeks} semana${diffWeeks === 1 ? "" : "s"}`;
};

const createNotificationItem = (notification: RawNotification): NotificationItem => {
  const normalizedType = normalizeNotificationType(notification.tipo);
  const rawEventId = notification.data?.evento_id;
  const eventId = typeof rawEventId === "number" ? rawEventId : undefined;
  const associatedEvent = eventId
    ? TEST_DATABASE.events.find((event) => event.id === eventId)
    : undefined;
  const ratingValue =
    typeof (notification as any).data?.rating === "number"
      ? (notification as any).data.rating
      : undefined;

  // Do not inject event names into messages; disable highlights
  const shouldHighlight = (_type: NotificationType): boolean => false;

  return {
    id: notification.id.toString(),
    type: normalizedType,
    image: notification.image as ImageSourcePropType,
    title: notification.titulo,
    message: notification.cuerpo,
    timeAgo: formatRelativeTime(notification.creado_en),
    highlightedText: shouldHighlight(normalizedType) ? associatedEvent?.titulo : undefined,
    rating: ratingValue,
    eventId: eventId ? eventId.toString() : undefined,
    eventName: associatedEvent?.titulo,
  };
};

export const getNotificationsForUser = (userId: number): NotificationItem[] =>
  TEST_DATABASE.notificaciones
    .filter((notification) => notification.usuario_id === userId)
    .sort(
      (a, b) =>
        new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
    )
    .map(createNotificationItem);

export const notificationsData: NotificationItem[] = getNotificationsForUser(
  PRIMARY_TEST_USER.id
);
