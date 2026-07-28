import { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button";
import Header from "../components/ui/Header";
import { chatService } from "../services/chat/ChatService";
import { useChatStore } from "../stores/useChatStore";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { ChatMessage } from "../types/ChatMessage";
import styles from "./Chat.module.css";

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content };
}

export default function Chat() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const clear = useChatStore((state) => state.clear);
  const providers = useSettingsStore((state) => state.providers);
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const gemini = providers.find((provider) => provider.id === "gemini");

  useEffect(() => { conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" }); }, [isSending, messages]);
  const send = async () => {
    const text = prompt.trim();
    if (!text || isSending || !gemini) return;
    const userMessage = createMessage("user", text);
    setPrompt(""); setError(null); setIsSending(true); addMessage(userMessage);
    try {
      const response = await chatService.sendPrompt([...messages, userMessage]);
      addMessage(createMessage("assistant", response.content));
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Unable to send the message.");
    } finally { setIsSending(false); }
  };

  return (
    <div className={styles.page}>
      <Header title="Chat" subtitle="Talk with Gemini using your configured API key." />
      <section aria-label="Conversation" className={styles.conversation} ref={conversationRef}>
        {messages.length === 0 && !isSending && <p className={styles.empty}>Start a conversation with Gemini.</p>}
        {messages.map((message) => <article className={`${styles.message} ${styles[message.role]}`} key={message.id}><span className={styles.speaker}>{message.role === "user" ? "You" : "Gemini"}</span><p>{message.content}</p></article>)}
        {isSending && <div className={styles.loading}><span className={styles.loader} />Gemini is thinking…</div>}
      </section>
      <div className={styles.composer}>
        <textarea aria-label="Prompt" disabled={isSending} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Gemini anything…" value={prompt} />
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}><Button disabled={messages.length === 0 || isSending} onClick={clear} variant="ghost">Clear chat</Button><Button disabled={!prompt.trim() || isSending || !gemini} onClick={send}>{isSending ? "Sending…" : "Send"}</Button></div>
      </div>
    </div>
  );
}
