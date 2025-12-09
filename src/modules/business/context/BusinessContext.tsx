import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import { navigationRef } from "@/src/core/navigation/navigationRef";
import { PROFILE_BUSINESS_LINK, PRIMARY_TEST_USER } from "@/src/core/test/profileData";
import {
  BUSINESS_ORGANIZER,
  BUSINESS_EVENTS,
  BUSINESS_TICKETS,
  BUSINESS_TEST_CREDENTIALS,
  BusinessEvent,
  Ticket,
} from "@/src/modules/business/test/businessData";

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
  organizer: typeof BUSINESS_ORGANIZER | null;
  events: BusinessEvent[];
  tickets: Ticket[];
  verificationCode: string;
  loginBusiness: () => void;
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
  const initialOrganizer = initialLinkFlag ? BUSINESS_ORGANIZER : null;

  const [isBusinessAuthenticated, setIsBusinessAuthenticated] = useState(false);
  const [isBusinessLinked, setIsBusinessLinked] = useState(initialLinkFlag);
  const [organizer, setOrganizer] = useState<typeof BUSINESS_ORGANIZER | null>(initialOrganizer);
  const [events, setEvents] = useState<BusinessEvent[]>(BUSINESS_EVENTS);
  const [tickets, setTickets] = useState<Ticket[]>(BUSINESS_TICKETS);
  const pendingFlowRef = useRef<BusinessPendingFlow | null>(null);

  const ensureOrganizer = useCallback(
    (overrides?: Partial<typeof BUSINESS_ORGANIZER>) => ({
      ...BUSINESS_ORGANIZER,
      ...overrides,
    }),
    []
  );

  const loginBusiness = useCallback(() => {
    setIsBusinessAuthenticated(true);
    setIsBusinessLinked(true);
    setOrganizer((prev) => prev ?? ensureOrganizer());
    pendingFlowRef.current = null;
  }, [ensureOrganizer]);

  const logoutBusiness = useCallback(() => {
    setIsBusinessAuthenticated(false);
  }, []);

  const switchToBusiness = useCallback(() => {
    if (isBusinessLinked && organizer) {
      setIsBusinessAuthenticated(true);
      if (navigationRef.isReady()) {
        navigationRef.navigate("Business" as never);
      }
    } else {
      openBusinessPortal("LoginBusiness");
    }
  }, [isBusinessLinked, organizer]);

  const addEvent = useCallback((event: BusinessEvent) => {
    setEvents((prev) => [...prev, event]);
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

    const organizerOverrides =
      pending.type === "register"
        ? {
            name: pending.organizationName || BUSINESS_ORGANIZER.name,
            email: pending.email,
          }
        : undefined;

    setOrganizer(ensureOrganizer(organizerOverrides));
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
        verificationCode: BUSINESS_TEST_CREDENTIALS.verificationCode,
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
