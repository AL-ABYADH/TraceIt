"use client";

import { createContext, useContext, useState } from "react";

const MaximizationContext = createContext({
  isMaximized: false,
  toggleMaximize: () => {},
});

export const useMaximization = () => useContext(MaximizationContext);

export const MaximizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <MaximizationContext.Provider value={{ isMaximized, toggleMaximize }}>
      {children}
    </MaximizationContext.Provider>
  );
};
