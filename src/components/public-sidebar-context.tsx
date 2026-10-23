"use client";

import * as React from "react";

const STORAGE_KEY = "proskill_sidebar_collapsed";
const CHANGE_EVENT = "proskillai:sidebar-collapsed";

interface PublicSidebarContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

const PublicSidebarContext = React.createContext<PublicSidebarContextValue | null>(null);

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persist(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function PublicSidebarProvider({ children }: { children: React.ReactNode }) {
  const collapsed = React.useSyncExternalStore(subscribe, readCollapsed, () => false);

  const setCollapsed = React.useCallback((value: boolean) => {
    persist(value);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    persist(!readCollapsed());
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, toggleSidebar }),
    [collapsed, setCollapsed, toggleSidebar]
  );

  return <PublicSidebarContext.Provider value={value}>{children}</PublicSidebarContext.Provider>;
}

export function usePublicSidebar(): PublicSidebarContextValue {
  const context = React.useContext(PublicSidebarContext);
  if (!context) {
    throw new Error("usePublicSidebar must be used within PublicSidebarProvider");
  }
  return context;
}
