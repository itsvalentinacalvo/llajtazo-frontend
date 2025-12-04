import { ImageSourcePropType } from "react-native";
import {
  PRIMARY_TEST_USER,
  PRIMARY_TEST_USER_INTERESTS,
  TEST_DATABASE,
} from "./testDatabase";

const DEFAULT_VERIFICATION_CODE = "4821";

const primaryUserFavoriteEventIds = TEST_DATABASE.favoritos
  .filter((favorite) => favorite.usuario_id === PRIMARY_TEST_USER.id)
  .map((favorite) => favorite.evento_id);

const favoriteEvents = TEST_DATABASE.events.filter((event) =>
  primaryUserFavoriteEventIds.includes(event.id)
);

const toInterestId = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

const PROFILE_INTEREST_IDS_LIST = PRIMARY_TEST_USER_INTERESTS.map((interest) =>
  toInterestId(interest)
);

const PROFILE_STATS = {
  following: TEST_DATABASE.organizadores.filter(
    (organizer) => organizer.suscribed === 1
  ).length,
  tickets: TEST_DATABASE.favoritos.filter(
    (favorite) => favorite.usuario_id === PRIMARY_TEST_USER.id
  ).length,
};

const PROFILE_ACCOUNTS_BASE = [
  {
    id: PRIMARY_TEST_USER.id.toString(),
    name: PRIMARY_TEST_USER.nombre_completo,
    avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
  },
];

const LINKED_ORGANIZER_ID: number | null = 501;

const linkedOrganizerRecord =
  LINKED_ORGANIZER_ID != null
    ? TEST_DATABASE.organizadores.find(
        (organizer) => organizer.id === LINKED_ORGANIZER_ID
      )
    : undefined;

export const PROFILE_BUSINESS_LINK = {
  isLinked: Boolean(linkedOrganizerRecord),
  organizer: linkedOrganizerRecord
    ? {
        id: linkedOrganizerRecord.id,
        name: linkedOrganizerRecord.nombre,
        about: linkedOrganizerRecord.about,
        followers: linkedOrganizerRecord.followers,
        subscribed: Boolean(linkedOrganizerRecord.suscribed),
        logo: linkedOrganizerRecord.logo_url as ImageSourcePropType,
      }
    : null,
};

export const PROFILE_SCREEN_DETAILS = {
  name: PRIMARY_TEST_USER.nombre_completo,
  email: PRIMARY_TEST_USER.email,
  bio: PRIMARY_TEST_USER.bio,
  interests: [...PROFILE_INTEREST_IDS_LIST],
  stats: PROFILE_STATS,
  avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
};

export const PROFILE_ACCOUNTS = PROFILE_ACCOUNTS_BASE.map((account) => ({
  ...account,
}));

export const PROFILE_INTEREST_IDS = [...PROFILE_INTEREST_IDS_LIST];

export const PROFILE_DEFAULT_AVATAR =
  PRIMARY_TEST_USER.avatar_url as ImageSourcePropType;

export const AUTH_TEST_CREDENTIALS = {
  email: PRIMARY_TEST_USER.email,
  password: PRIMARY_TEST_USER.plain_password,
  name: PRIMARY_TEST_USER.nombre_completo,
  verificationCode: DEFAULT_VERIFICATION_CODE,
  bio: PRIMARY_TEST_USER.bio,
  interests: PRIMARY_TEST_USER_INTERESTS,
  avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
  passwordHash: PRIMARY_TEST_USER.password_hash,
  favorites: primaryUserFavoriteEventIds,
};

export const TEST_CREDENTIALS = AUTH_TEST_CREDENTIALS;

export const BURGER_MENU_PROFILE = {
  id: PRIMARY_TEST_USER.id,
  name: PRIMARY_TEST_USER.nombre_completo,
  email: PRIMARY_TEST_USER.email,
  bio: PRIMARY_TEST_USER.bio,
  avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
  joinedAt: PRIMARY_TEST_USER.created_at,
  favoriteEvents,
  favoritesCount: favoriteEvents.length,
};

export const getFavoriteEventsForUser = (userId: number) => {
  const favoriteIds = TEST_DATABASE.favoritos
    .filter((favorite) => favorite.usuario_id === userId)
    .map((favorite) => favorite.evento_id);

  return TEST_DATABASE.events.filter((event) => favoriteIds.includes(event.id));
};

export const getUserById = (userId: number) =>
  TEST_DATABASE.usuarios.find((user) => user.id === userId);

export { PRIMARY_TEST_USER, PRIMARY_TEST_USER_INTERESTS, TEST_DATABASE };
