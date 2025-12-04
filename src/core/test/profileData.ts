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
