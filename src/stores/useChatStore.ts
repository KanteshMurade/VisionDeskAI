import { create } from "zustand";
import type { ChatMessage } from "../types/ChatMessage";

interface ChatState {
  clear: () => void;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clear: () => set({ messages: [] }),
}));
