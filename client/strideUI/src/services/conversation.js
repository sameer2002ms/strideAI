import api from "./api";

// 📌 Get all conversations
export const getConversations = async () => {
  const res = await api.get("/conversations/");
  return res.data;
};

// 📌 Create new conversation
export const createConversation = async (data) => {
  const res = await api.post("/conversations/", data);
  return res.data;
};

// 📌 Send message to conversation (IMPORTANT)
export const sendMessage = async (conversationId, message) => {
  const res = await api.post(`/conversations/${conversationId}/messages/`, {
    content: message,
  });
  return res.data;
};
