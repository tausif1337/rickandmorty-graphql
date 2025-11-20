import React, { createContext, useContext, ReactNode } from "react";
import { useReactiveVar } from "@apollo/client/react";
import {
  currentPageVar,
} from "../config/apolloClient";

interface AppContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // useReactiveVar automatically subscribes to changes in currentPageVar
  // and only triggers re-renders when the value actually changes
  const currentPage = useReactiveVar(currentPageVar);

  const setCurrentPage = (page: number) => {
    currentPageVar(page);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  
  return context;
};
