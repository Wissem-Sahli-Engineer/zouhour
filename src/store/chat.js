import { create } from "zustand";

export const useChatStore = create((set) => ({
  pageMessages: [],
  setPageMessages: (updater) =>
    set((s) => ({
      pageMessages: typeof updater === "function" ? updater(s.pageMessages) : updater,
    })),
}));
