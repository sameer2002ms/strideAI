import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
} from "../services/conversation.js";

// 📌 Backend message shape uses sender: "USER" | "ASSISTANT" + created_at.
// Normalize into the { role, content, timestamp } shape the UI already renders.
function normalizeMessage(m) {
  if (!m) return null;
  return {
    id: m.id,
    role: (m.sender || "").toLowerCase() === "assistant" ? "assistant" : "user",
    content: m.content,
    timestamp: m.created_at,
  };
}

// 📌 Surfaces DRF validation errors without touching any error UI components
function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  const firstVal = data?.[firstKey];
  if (Array.isArray(firstVal)) return `${firstKey}: ${firstVal[0]}`;
  return "Something went wrong. Please try again.";
}

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // 📌 Open a conversation and populate the chat window from GET /conversations/{id}/
  // (the list endpoint doesn't reliably include full message bodies)
  const openConversation = async (chat) => {
    setActiveChat(chat);
    try {
      const details = await getConversation(chat.id);
      setMessages((details.messages || []).map(normalizeMessage));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // 📌 Load conversations
  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);

      if (data.length > 0 && !activeChat) {
        await openConversation(data[0]);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 📌 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 📌 Select chat
  const selectChat = async (chat) => {
    setSidebarOpen(false);
    await openConversation(chat);
  };

  // 📌 Create new chat
  const handleNewChat = async () => {
    setError(null);
    try {
      const newChat = await createConversation({
        channel: "web",
        metadata: {},
      });
      setConversations((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
      setMessages([]);
      setSidebarOpen(false);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // 📌 Send message
  // Shows the user's message immediately for responsiveness, then reconciles
  // with the server's canonical user_message + assistant_message once it replies.
  // Only one request is made per send — no polling, no second call.
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticUserMessage = {
      id: tempId,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await sendMessage(activeChat.id, input);
      const realUserMessage = normalizeMessage(res.user_message);
      const realAssistantMessage = normalizeMessage(res.assistant_message);

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempId);
        return [...withoutTemp, realUserMessage, realAssistantMessage];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setError(extractErrorMessage(err));
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex h-full gap-4 relative">
        {/* MOBILE SIDEBAR TOGGLE */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className="lg:hidden absolute top-0 left-0 z-20 flex items-center gap-1.5 text-xs text-gray-400
                     bg-[#111827] border border-[#27272A] rounded-lg px-2.5 py-1.5
                     hover:text-[#FACC15] transition-colors duration-200"
        >
          <MenuIcon className="w-4 h-4" />
          Chats
        </button>

        {/* LEFT SIDEBAR */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-10 w-72 lg:w-64 bg-[#111827] border border-[#27272A]
                      p-3 rounded-none lg:rounded-2xl flex flex-col flex-shrink-0
                      transition-transform duration-300 ease-in-out
                      ${sidebarOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}`}
        >
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-[#FACC15] text-[#0F172A]
                       font-semibold p-2.5 rounded-xl mb-3 shadow-md shadow-[#FACC15]/20
                       hover:bg-[#EAB308] hover:scale-[1.02] active:scale-95
                       transition-all duration-200 ease-in-out"
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.length === 0 && (
              <p className="text-xs text-gray-500 text-center mt-6 px-2">
                No conversations yet — start one above.
              </p>
            )}

            {conversations.map((c) => {
              const active = activeChat?.id === c.id;
              // Backend conversation object has no "title" field — fall back gracefully.
              const label =
                c.title || c.metadata?.title || `Conversation #${c.id}`;
              return (
                <div
                  key={c.id}
                  onClick={() => selectChat(c)}
                  className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm
                              transition-all duration-200 ease-in-out
                              ${
                                active
                                  ? "bg-[#FACC15]/10 text-[#FACC15]"
                                  : "text-gray-400 hover:bg-[#18181B] hover:text-white"
                              }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-[#FACC15]" />
                  )}
                  <ChatBubbleIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[5] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-[#111827] border border-[#27272A] rounded-2xl min-w-0">
          {/* ERROR BANNER */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 px-4 py-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
              {error}
            </div>
          )}

          {/* MESSAGES */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-5">
            {!activeChat ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] mb-4">
                  <ChatBubbleIcon className="w-6 h-6" />
                </div>
                <p className="text-base font-medium text-white">
                  No conversation selected
                </p>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Start a new chat to talk with StrideAI.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] mb-4">
                  <SparkleIcon className="w-6 h-6" />
                </div>
                <p className="text-base font-medium text-white">Say hello 👋</p>
                <p className="text-sm text-gray-500 mt-1 max-w-xs">
                  Ask about your goals, check in on progress, or just chat.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble key={msg.id ?? idx} msg={msg} />
              ))
            )}

            {loading && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          {/* INPUT BOX */}
          <div className="p-3 sm:p-4 border-t border-[#27272A] flex items-end gap-2">
            <button
              type="button"
              aria-label="Attach file"
              className="text-gray-500 hover:text-[#FACC15] p-2.5 rounded-xl hover:bg-[#18181B]
                         transition-all duration-200 ease-in-out flex-shrink-0"
            >
              <PaperclipIcon className="w-5 h-5" />
            </button>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!activeChat}
              className="flex-1 p-3 bg-[#18181B] border border-[#27272A] rounded-xl text-sm text-white
                         placeholder-gray-500 outline-none focus:border-[#FACC15]/50
                         disabled:opacity-50 transition-colors duration-200"
              placeholder="Message StrideAI..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || !activeChat || loading}
              aria-label="Send message"
              className="bg-[#FACC15] text-[#0F172A] p-3 rounded-xl flex-shrink-0
                         hover:bg-[#EAB308] hover:scale-105 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                         transition-all duration-200 ease-in-out"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- message bubble ---------- */

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const time = msg.timestamp || msg.created_at;

  return (
    <div
      className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                    ${isUser ? "bg-[#27272A] text-gray-300" : "bg-[#FACC15]/10 text-[#FACC15]"}`}
      >
        {isUser ? "U" : "AI"}
      </div>

      <div
        className={`flex flex-col max-w-[80%] sm:max-w-lg ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed break-words
                      transition-all duration-200 ease-in-out
                      ${
                        isUser
                          ? "bg-[#FACC15] text-[#0F172A] rounded-tr-sm"
                          : "bg-[#18181B] text-gray-100 rounded-tl-sm border border-[#27272A]"
                      }`}
        >
          <MessageContent content={msg.content} isUser={isUser} />
        </div>
        {time && (
          <span className="text-[11px] text-gray-500 mt-1 px-1">
            {new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- lightweight markdown-ish renderer ---------- */
/* Supports fenced code blocks, inline code, and **bold** without adding a dependency */

function MessageContent({ content, isUser }) {
  if (!content) return null;

  const parts = String(content).split(/```/g);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <CodeBlock key={i} code={part} />
        ) : (
          <span key={i}>
            {part.split("\n").map((line, j) => (
              <span key={j}>
                {renderInline(line)}
                {j < part.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        ),
      )}
    </>
  );

  function renderInline(line) {
    const segments = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
    return segments.map((seg, k) => {
      if (seg.startsWith("`") && seg.endsWith("`")) {
        return (
          <code
            key={k}
            className={`px-1.5 py-0.5 rounded font-mono text-[13px] ${
              isUser ? "bg-black/10" : "bg-black/30"
            }`}
          >
            {seg.slice(1, -1)}
          </code>
        );
      }
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return <strong key={k}>{seg.slice(2, -2)}</strong>;
      }
      return <span key={k}>{seg}</span>;
    });
  }
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const firstLine = code.split("\n")[0].trim();
  const lang = /^[a-zA-Z]+$/.test(firstLine) ? firstLine : "";
  const body = lang ? code.split("\n").slice(1).join("\n") : code;

  const handleCopy = () => {
    navigator.clipboard?.writeText(body.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-2 rounded-xl overflow-hidden border border-[#27272A] bg-[#0F172A]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#18181B] border-b border-[#27272A]">
        <span className="text-[11px] text-gray-500 font-mono">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="text-[11px] text-gray-400 hover:text-[#FACC15] transition-colors duration-200"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[13px] font-mono text-gray-200 leading-relaxed">
        {body.trim()}
      </pre>
    </div>
  );
}

/* ---------- typing indicator ---------- */

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full bg-[#FACC15]/10 text-[#FACC15] flex items-center justify-center text-xs font-semibold flex-shrink-0">
        AI
      </div>
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
      </div>
    </div>
  );
}

/* ---------- icons ---------- */

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SendIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4.5 12 20 4l-5 16-3.5-6.5L4.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PaperclipIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8 12.5 15 5.4a3 3 0 1 1 4.2 4.2l-8.6 8.6a5 5 0 1 1-7-7l7.6-7.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChatBubbleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 5h16v11H8l-4 4V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
