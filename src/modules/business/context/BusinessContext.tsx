import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import { navigationRef } from "@/src/core/navigation/navigationRef";
import { PROFILE_BUSINESS_LINK, PRIMARY_TEST_USER } from "@/src/core/test/profileData";
import { TEST_DATABASE } from "@/src/core/test/testDatabase";
import { BusinessEvent, Ticket } from "@/src/modules/business/test/businessData";

type BusinessPendingFlow =
  | {
      type: "register";
      organizationName: string;
      email: string;
      username: string;
    }
  | {
      type: "reset";
      email: string;
    };

interface BusinessContextType {
  isBusinessAuthenticated: boolean;
  isBusinessLinked: boolean;
  organizer: {
    id: number;
    name: string;
    email?: string;
    bio?: string;
    followers?: number;
    logo?: any;
    isPlus?: boolean;
  } | null;
  events: BusinessEvent[];
  tickets: Ticket[];
  verificationCode: string;
  loginBusiness: (organizerId: number) => void;
  logoutBusiness: () => void;
  switchToBusiness: () => void;
  addEvent: (event: BusinessEvent) => void;
  updateEvent: (eventId: string, updates: Partial<BusinessEvent>) => void;
  addTicket: (ticket: Ticket) => void;
  startBusinessRegistration: (payload: {
    organizationName: string;
    email: string;
    username: string;
  }) => void;
  startBusinessPasswordReset: (payload: { email: string }) => void;
  completePendingVerification: () => boolean;
  openBusinessPortal: (
    initialRoute?: "LoginBusiness" | "RegisterBusiness"
  ) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const initialLinkFlag = Boolean(
    PROFILE_BUSINESS_LINK.isLinked || PRIMARY_TEST_USER.isVinculated
  );
  const initialOrganizer = initialLinkFlag && TEST_DATABASE.organizadores[0]
    ? {
        id: TEST_DATABASE.organizadores[0].id,
        name: TEST_DATABASE.organizadores[0].nombre,
        email: TEST_DATABASE.organizadores[0].email,
        bio: TEST_DATABASE.organizadores[0].about,
        followers: TEST_DATABASE.organizadores[0].followers,
        logo: TEST_DATABASE.organizadores[0].logo_url,
        isPlus: (TEST_DATABASE.organizadores[0] as any).isPlus ?? false,
      }
    : null;

  const [isBusinessAuthenticated, setIsBusinessAuthenticated] = useState(false);
  const [isBusinessLinked, setIsBusinessLinked] = useState(initialLinkFlag);
  const [organizer, setOrganizer] = useState<{
    id: number;
    name: string;
    email?: string;
    bio?: string;
    followers?: number;
    logo?: any;
    isPlus?: boolean;
  } | null>(initialOrganizer);
  const [events, setEvents] = useState<BusinessEvent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const pendingFlowRef = useRef<BusinessPendingFlow | null>(null);

  const ensureOrganizer = useCallback(
    (orgId: number) => {
      const record = TEST_DATABASE.organizadores.find((o) => o.id === orgId);
      if (!record) return null;
      return {
        id: record.id,
        name: record.nombre,
        email: record.email,
        bio: record.about,
        followers: record.followers,
        logo: record.logo_url,
        isPlus: (record as any).isPlus ?? false,
      };
    },
    []
  );

  const loginBusiness = useCallback((organizerId: number) => {
    const org = ensureOrganizer(organizerId);
    if (!org) {
      console.warn("[BusinessContext] Organizer not found for id", organizerId);
      return;
    }
    setIsBusinessAuthenticated(true);
    setIsBusinessLinked(true);
    setOrganizer(org);
    // Scope events and tickets to this organizer
    const scopedEvents: BusinessEvent[] = (TEST_DATABASE.events || [])
      .filter((e) => e.organizador_id === organizerId)
      .map((e) => {
        const place = (TEST_DATABASE.lugares || []).find((l) => l.id === e.lugar_id);
        const dt = new Date(e.start_time);
        const dayNum = dt.getDate().toString().padStart(2, "0");
        const month = dt.toLocaleDateString("es-ES", { month: "long" }).toUpperCase();
        const date = `${dayNum} DE ${month}`;
        const time = dt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        // Prefer canonical totals from TEST_DATABASE event record
        const ticketsSold = (e as any).ticketsSold ?? 0;
        const totalSales = (e as any).totalSales ?? 0;
        const status: BusinessEvent["status"] = "active";
        return {
          id: String(e.id),
          title: e.titulo,
          subtitle: e.subtitulo || "",
          date,
          time,
          image: e.cover_url,
          location: place?.nombre || "",
          totalSales,
          ticketsSold,
          status,
          tags: [],
          descriptionHTML: e.descripcion,
          googleMapsLink: place ? `https://www.google.com/maps?q=${place.latitud},${place.longitud}` : undefined,
          startTimeIso: e.start_time,
          // Attach tickets if present in DB
          tickets: Array.isArray((e as any).tickets)
            ? ((e as any).tickets as Array<any>).map((t) => ({
                id: String(t.id),
                name: t.name,
                price: t.price,
                currency: t.currency || "Bs.",
                available: Boolean(t.available),
                isSoldOut: Boolean(t.isSoldOut),
              }))
            : undefined,
        } as BusinessEvent;
      });
    setEvents(scopedEvents);
    // Build scoped tickets from events' tickets (TEST_DATABASE stores tickets inside each event)
    const scopedTickets: Ticket[] = (TEST_DATABASE.events || [])
      .filter((e: any) => e.organizador_id === organizerId)
      .flatMap((e: any) => {
        if (!Array.isArray(e.tickets)) return [] as Ticket[];
        return (e.tickets as any[]).map((t: any) => ({
          id: String(t.id),
          name: t.name ?? t.nombre ?? "",
          price: t.price ?? t.precio ?? 0,
          fee: 0,
          stock: Number(t.stock ?? 0),
          soldCount: Number(t.soldCount ?? 0),
          isFree: Boolean(t.isFree ?? false),
          minPerPurchase: Number(t.minPerPurchase ?? 1),
          maxPerPurchase: Number(t.maxPerPurchase ?? 1),
          available: Boolean(t.available ?? t.stock ?? true),
          eventId: String(e.id),
        } as unknown as Ticket));
      });
    setTickets(scopedTickets);
    pendingFlowRef.current = null;
  }, [ensureOrganizer]);

  const logoutBusiness = useCallback(() => {
    setIsBusinessAuthenticated(false);
  }, []);

  const switchToBusiness = useCallback(() => {
    if (isBusinessLinked && organizer) {
      // Ensure scoped data is loaded before navigating
      loginBusiness(organizer.id);
      setIsBusinessAuthenticated(true);
      if (navigationRef.isReady()) {
        navigationRef.navigate("Business" as never);
      }
    } else {
      openBusinessPortal("LoginBusiness");
    }
  }, [isBusinessLinked, organizer, loginBusiness]);

  const addEvent = useCallback((event: BusinessEvent) => {
    try {
      console.log("[BusinessContext] Añadiendo evento", event);
      setEvents((prev) => [...prev, event]);
    } catch (err) {
      console.error("[BusinessContext] Error al añadir evento:", err, { event });
    }
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<BusinessEvent>) => {
    setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, ...updates } : e));
  }, []);

  const addTicket = useCallback((ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  }, []);

  const startBusinessRegistration = useCallback(
    (payload: { organizationName: string; email: string; username: string }) => {
      pendingFlowRef.current = {
        type: "register",
        organizationName: payload.organizationName,
        email: payload.email,
        username: payload.username,
      };
    },
    []
  );

  const startBusinessPasswordReset = useCallback((payload: { email: string }) => {
    pendingFlowRef.current = {
      type: "reset",
      email: payload.email,
    };
  }, []);

  const completePendingVerification = useCallback(() => {
    const pending = pendingFlowRef.current;
    if (!pending) {
      return false;
    }
    // On verification, link to first organizer as a simple default
    const firstOrg = TEST_DATABASE.organizadores[0];
    const ensured = firstOrg ? ensureOrganizer(firstOrg.id) : null;
    if (ensured) setOrganizer(ensured);
    setIsBusinessLinked(true);
    setIsBusinessAuthenticated(true);
    pendingFlowRef.current = null;
    return true;
  }, [ensureOrganizer]);

  const openBusinessPortal = useCallback(
    (initialRoute: "LoginBusiness" | "RegisterBusiness" = "RegisterBusiness") => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Business", { initialAuthRoute: initialRoute });
      } else {
        console.warn("[BusinessContext] navigationRef not ready to open Business portal");
      }
    },
    []
  );

  return (
    <BusinessContext.Provider
      value={{
        isBusinessAuthenticated,
        isBusinessLinked,
        organizer,
        events,
        tickets,
        verificationCode: "000000",
        loginBusiness,
        logoutBusiness,
        switchToBusiness,
        addEvent,
        updateEvent,
        addTicket,
        startBusinessRegistration,
        startBusinessPasswordReset,
        completePendingVerification,
        openBusinessPortal,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
