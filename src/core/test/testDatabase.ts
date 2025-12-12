import { EventFormData } from "@/src/modules/business/types/event";

export interface DraftEvent extends EventFormData {
  id: string;
  createdAt: string;
  status: "draft" | "preview" | "published";
}

const draftEventsStore: DraftEvent[] = [];

export const addDraftEvent = (formData: EventFormData): DraftEvent => {
  const draftEvent: DraftEvent = {
    ...formData,
    id: `draft-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "preview",
  };
  draftEventsStore.push(draftEvent);
  return draftEvent;
};

export const getDraftEventById = (id: string): DraftEvent | undefined => {
  return draftEventsStore.find((event) => event.id === id);
};

export const updateDraftEventStatus = (id: string, status: DraftEvent["status"]): void => {
  const event = draftEventsStore.find((e) => e.id === id);
  if (event) {
    event.status = status;
  }
};

export const getAllDraftEvents = (): DraftEvent[] => {
  return [...draftEventsStore];
};

export const TEST_DATABASE = {
  categorias: [
    { id: 1, nombre: "Cultura" },
    { id: 2, nombre: "Música" },
    { id: 3, nombre: "Ferias" },
    { id: 4, nombre: "Arte" },
    { id: 5, nombre: "Danza" },
  ],
  usuarios: [
    {
      id: 1001,
      email: "anahi@llajtazo.com",
      nombre_completo: "Anahi Zambrano",
      password_hash: "$2b$10$dummylLajtazoHashPass123456789abcdefghijk",
      plain_password: "pass123",
      avatar_url: require("@/src/core/test/assets/user-profile.png"),
      created_at: "2024-07-12T14:23:00Z",
      bio: "Estoy usando Llajtazo App para descubrir eventos increibles cerca de mi",
      isVinculated: false,
      business_organizer_id: null,
    },
  ],
  organizadores: [
    {
      id: 501,
      nombre: "NOMA",
      about: "Comunidad que impulsa eventos para emprendedores locales",
      logo_url: require("@/src/core/assets/events/noma/profile.png"),
      followers: 12750,
      suscribed: 1,
    },
    {
      id: 502,
      nombre: "Alice Park",
      about: "Productora de experiencias al aire libre",
      logo_url: require("@/src/core/assets/events/alice-park/profile.jpg"),
      followers: 9800,
      suscribed: 1,
    },
  ],
  lugares: [
    {
      id: 701,
      nombre: "Alice Park",
      direccion: "Av. Melchor Urquidi, Cochabamba",
      latitud: -17.376642360467393,
      longitud: -66.14978895823978,
    },
    {
      id: 702,
      nombre: "NOMA",
      direccion: "Av. Melchor Urquidi, Cochabamba",
      latitud: -17.3755683230705,
      longitud: -66.14949157866889,
    },
  ],
  events: [
    {
      id: 901,
      organizador_id: 502,
      lugar_id: 701,
      categoria_id: 1,
      titulo: "Sunset Beats",
      descripcion: "Festival con artistas de musica electronica y foodtrucks",
      start_time: "2025-01-20T21:00:00",
      end_time: "2025-01-21T02:00:00",
      cover_url: require("@/src/core/assets/events/alice-park/event5.jpg"),
      estado: "PUBLISHED",
    },
    {
      id: 902,
      organizador_id: 502,
      lugar_id: 702,
      categoria_id: 2,
      titulo: "Tech Meetup Cochabamba",
      descripcion: "Charlas sobre IA, desarrollo mobile y networking",
      start_time: "2025-02-10T18:30:00",
      end_time: "2025-02-10T21:00:00",
      cover_url: require("@/src/core/assets/events/fexco/event2.png"),
      estado: "PUBLISHED",
    },
  ],
  favoritos: [
    {
      usuario_id: 1001,
      evento_id: 901,
      creado_en: "2025-01-05T18:10:00Z",
    },
    {
      usuario_id: 1001,
      evento_id: 902,
      creado_en: "2025-01-15T09:45:00Z",
    },
  ],
  intereses_usuario: [
    { usuario_id: 1001, categorias_id: 1 },
    { usuario_id: 1001, categorias_id: 2 },
    { usuario_id: 1001, categorias_id: 4 },
  ],
  notificaciones: [
    {
      id: 30001,
      usuario_id: 1001,
      tipo: "EVENT_REMINDER",
      image: require("@/src/core/assets/events/alice-park/event4.jpg"),
      titulo: "Tu evento Sunset Beats Alice Park empieza pronto",
      cuerpo: "Preparate para disfrutar de la noche en Alice Park",
      data: { evento_id: 901, start_time: "2025-01-20T21:00:00" },
      creado_en: "2025-01-20T15:00:00Z",
      leido_en: null,
    },
    {
      id: 30002,
      usuario_id: 1001,
      tipo: "FAVORITE_EVENT_UPDATE",
      image: require("@/src/core/assets/events/noma/profile.png"),
      titulo: "Tech Meetup Cochabamba actualizo sus detalles",
      cuerpo: "Se modifico la hora de inicio del evento",
      data: { evento_id: 902 },
      creado_en: "2025-02-01T12:30:00Z",
      leido_en: "2025-02-02T08:05:00Z",
    },
    {
      id: 30003,
      usuario_id: 1001,
      tipo: "ticket_available",
      image: require("@/src/core/assets/events/fexco/event2.png"),
      titulo: "Tu TICKET para TECH MEETUP COCHABAMBA se encuentra disponible",
      cuerpo: "Asegura tu lugar antes de que se agoten",
      data: { evento_id: 902 },
      creado_en: "2025-12-11T07:00:00Z",
      leido_en: null,
    },
    {
      id: 30004,
      usuario_id: 1001,
      tipo: "new_event",
      image: require("@/src/core/assets/events/noma/profile.png"),
      titulo: "NOMA acaba de publicar un evento que podría interesarte",
      cuerpo: "Tech Meetup Cochabamba",
      data: { evento_id: 902 },
      creado_en: "2025-12-11T03:00:00Z",
      leido_en: null,
    },
    {
      id: 30005,
      usuario_id: 1001,
      tipo: "opinion_request",
      image: require("@/src/core/assets/events/alice-park/profile.jpg"),
      titulo: "Nos interesa tu Opinión!",
      cuerpo: "¿Qué tal estuvo Sunset Beats Alice Park?",
      data: { evento_id: 901, rating: 0 },
      creado_en: "2025-12-10T12:00:00Z",
      leido_en: null,
    },
    {
      id: 30006,
      usuario_id: 1001,
      tipo: "event_update",
      image: require("@/src/core/assets/events/alice-park/event5.jpg"),
      titulo: "Alice Park actualizó detalles sobre Sunset Beats Alice Park",
      cuerpo: "Se añadieron nuevos artistas y foodtrucks",
      data: { evento_id: 901 },
      creado_en: "2025-12-09T09:00:00Z",
      leido_en: null,
    },
    {
      id: 30007,
      usuario_id: 1001,
      tipo: "sold_out",
      image: require("@/src/core/assets/events/alice-park/event4.jpg"),
      titulo: "Sunset Beats Alice Park - SOLD OUT",
      cuerpo: "Gracias por tu interés, pronto más experiencias inolvidables!",
      data: { evento_id: 901 },
      creado_en: "2025-12-07T18:00:00Z",
      leido_en: null,
    },
    {
      id: 30008,
      usuario_id: 1001,
      tipo: "tickets_low",
      image: require("@/src/core/assets/events/fexco/event2.png"),
      titulo: "Tech Meetup Cochabamba tickets por agotarse!",
      cuerpo: "Quedan pocas entradas, no te quedes afuera",
      data: { evento_id: 902 },
      creado_en: "2025-12-04T10:00:00Z",
      leido_en: null,
    },
  ],
  organizer_reviews: [
    {
      id: 40001,
      organizer_id: 502,
      eventId: 901,
      userName: "Carla Morales",
      userAvatar: require("@/src/core/assets/profiles/profile2.png"),
      rating: 5,
      date: "2025-01-22",
      comment: "Sunset Beats fue increíble, buena música y ambiente!",
    },
    {
      id: 40002,
      organizer_id: 502,
      eventId: 901,
      userName: "Luis Sanchez",
      userAvatar: require("@/src/core/assets/profiles/profile1.png"),
      rating: 4,
      date: "2025-01-21",
      comment: "Excelente organización, faltó un poco más de señalización.",
    },
    {
      id: 40003,
      organizer_id: 502,
      eventId: 902,
      userName: "Andrea Rodriguez",
      userAvatar: require("@/src/core/assets/profiles/profile3.png"),
      rating: 5,
      date: "2025-02-11",
      comment: "Tech Meetup estuvo genial, charlas muy útiles y networking!",
    },
    {
      id: 40004,
      organizer_id: 502,
      eventId: 902,
      userName: "Diego Martinez",
      userAvatar: require("@/src/core/assets/profiles/profile4.png"),
      rating: 3,
      date: "2025-02-10",
      comment: "Buen contenido, pero el audio pudo estar mejor.",
    },
  ],
} as const;

export const PRIMARY_TEST_USER = TEST_DATABASE.usuarios[0];

export const PRIMARY_TEST_USER_INTEREST_IDS = TEST_DATABASE.intereses_usuario
  .filter((interest) => interest.usuario_id === PRIMARY_TEST_USER.id)
  .map((interest) => interest.categorias_id);

type CategoryName = (typeof TEST_DATABASE.categorias)[number]["nombre"];

export const PRIMARY_TEST_USER_INTERESTS = PRIMARY_TEST_USER_INTEREST_IDS
  .map((categoryId) => TEST_DATABASE.categorias.find((category) => category.id === categoryId)?.nombre)
  .filter((nombre): nombre is CategoryName => Boolean(nombre));
