import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface HomeHeaderContextValue {
  selectedCategory?: string;
  setSelectedCategory: (cat?: string) => void;
  headerHeight: number;
  setHeaderHeight: (h: number) => void;
}

const HomeHeaderContext = createContext<HomeHeaderContextValue | undefined>(undefined);

export function HomeHeaderProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategoryState] = useState<string | undefined>(undefined);
  const [headerHeight, setHeaderHeightState] = useState<number>(0);

  const setSelectedCategory = useCallback((cat?: string) => {
    setSelectedCategoryState(cat);
  }, []);

  const setHeaderHeight = useCallback((h: number) => {
    setHeaderHeightState(h);
  }, []);

  return (
    <HomeHeaderContext.Provider
      value={{ selectedCategory, setSelectedCategory, headerHeight, setHeaderHeight }}
    >
      {children}
    </HomeHeaderContext.Provider>
  );
}

export function useHomeHeader() {
  const ctx = useContext(HomeHeaderContext);
  if (!ctx) throw new Error("useHomeHeader must be used within HomeHeaderProvider");
  return ctx;
}
