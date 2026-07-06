import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  getConversations,
  createConversation,
  sendMessage,
} from "../services/conversation.js";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // 📌 Load conversations
  const loadConversations = async () => {
    const data = await getConversations();
    setConversations(data);

    if (data.length > 0 && !activeChat) {
      setActiveChat(data[0]);
      setMessages(data[0].messages || []);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 📌 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📌 Select chat
  const selectChat = (chat) => {
    setActiveChat(chat);
    setMessages(chat.messages || []);
  };

  // 📌 Create new chat
  const handleNewChat = async () => {
    const newChat = await createConversation({
      title: "New Chat",
    });

    setConversations([newChat, ...conversations]);
    setActiveChat(newChat);
    setMessages([]);
  };

  // 📌 Send message
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(activeChat.id, input);

      // backend may return different shapes; prefer assistant_message.content
      const aiContent =
        res?.assistant_message?.content || res?.reply || res?.message || res?.content;

      const aiMessage = {
        role: "assistant",
        content: aiContent || "",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex h-full gap-4">
        {/* LEFT SIDEBAR */}
        <div className="w-64 bg-gray-900 p-3 rounded-xl">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 p-2 rounded mb-3"
          >
            + New Chat
          </button>

          <div className="space-y-2">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => selectChat(c)}
                className={`p-2 rounded cursor-pointer ${
                  activeChat?.id === c.id ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                {c.title || "Untitled"}
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-gray-900 rounded-xl">
          {/* MESSAGES */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded max-w-lg ${
                  msg.role === "user" ? "ml-auto bg-blue-600" : "bg-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && <div className="text-gray-400">AI is thinking...</div>}

            <div ref={bottomRef} />
          </div>

          {/* INPUT BOX */}
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-gray-800 rounded"
              placeholder="Message StrideAI..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button onClick={handleSend} className="bg-green-600 px-4 rounded">
              Send
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
