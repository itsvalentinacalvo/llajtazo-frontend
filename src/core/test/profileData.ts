import { ImageSourcePropType } from "react-native";
import {
  PRIMARY_TEST_USER,
  PRIMARY_TEST_USER_INTERESTS,
  TEST_DATABASE,
} from "./testDatabase";

const DEFAULT_VERIFICATION_CODE = "4821";

// Favoritos hardcoded removidos: la app usa bookmarks dinámicos desde contexto.

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
  // Tickets/favoritos dinámicos: calcular en pantalla via contexto
  tickets: 0,
};

const PROFILE_ACCOUNTS_BASE = [
  {
    id: PRIMARY_TEST_USER.id.toString(),
    name: PRIMARY_TEST_USER.nombre_completo,
    avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
  },
];

const LINKED_ORGANIZER_ID: number | null =
  typeof PRIMARY_TEST_USER.business_organizer_id === "number"
    ? PRIMARY_TEST_USER.business_organizer_id
    : null;

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
  // Sin favoritos hardcoded
};

export const TEST_CREDENTIALS = AUTH_TEST_CREDENTIALS;

export const BURGER_MENU_PROFILE = {
  id: PRIMARY_TEST_USER.id,
  name: PRIMARY_TEST_USER.nombre_completo,
  email: PRIMARY_TEST_USER.email,
  bio: PRIMARY_TEST_USER.bio,
  avatar: PRIMARY_TEST_USER.avatar_url as ImageSourcePropType,
  joinedAt: PRIMARY_TEST_USER.created_at,
};

// getFavoriteEventsForUser removido: usar SavedEventsContext o bookmarks runtime

export const getUserById = (userId: number) =>
  TEST_DATABASE.usuarios.find((user) => user.id === userId);

export { PRIMARY_TEST_USER, PRIMARY_TEST_USER_INTERESTS, TEST_DATABASE };
