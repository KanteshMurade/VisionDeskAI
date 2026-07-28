import type { ChatRole } from "./ChatRole";

export interface ChatMessage {
  content: string;
  id: string;
  role: ChatRole;
}
