import { create } from "zustand";

export const useUi = create((set) => ({
  sidebarOpen: true,
  chatbotOpen: false,
  search: "",
  notifications: [
    { id: 1, text: "3 documents pending review", time: "12m" },
    { id: 2, text: "Invoice #1042 is overdue", time: "1h" },
    { id: 3, text: "New client request: Marwan A.", time: "3h" },
  ],
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (sidebarOpen) => set({ sidebarOpen }),
  toggleChatbot: () => set((s) => ({ chatbotOpen: !s.chatbotOpen })),
  setChatbot: (chatbotOpen) => set({ chatbotOpen }),
  setSearch: (search) => set({ search }),
}));
