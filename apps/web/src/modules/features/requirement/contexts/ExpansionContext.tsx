"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface ExpansionContextProps {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
  expandItems: (ids: string[]) => void;
}

const ExpansionContext = createContext<ExpansionContextProps | undefined>(undefined);

export const ExpansionProvider = ({ children }: { children: ReactNode }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const expandItems = useCallback((ids: string[]) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      ids.forEach((id) => newSet.add(id));
      return newSet;
    });
  }, []);

  return (
    <ExpansionContext.Provider value={{ expandedItems, toggleItem, expandItems }}>
      {children}
    </ExpansionContext.Provider>
  );
};

export const useExpansion = () => {
  const context = useContext(ExpansionContext);
  if (!context) {
    throw new Error("useExpansion must be used within an ExpansionProvider");
  }
  return context;
};
