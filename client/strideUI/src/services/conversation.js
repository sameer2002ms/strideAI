import api from "./api";

// 📌 Get all conversations (optionally filtered by status, e.g. "ACTIVE")
export const getConversations = async (status) => {
  const params = status ? { status } : {};
  const res = await api.get("/conversations/", { params });
  return res.data;
};

// 📌 Get a single conversation, including its messages
export const getConversation = async (id) => {
  const res = await api.get(`/conversations/${id}/`);
  return res.data;
};

// 📌 Create a new conversation
export const createConversation = async (data) => {
  const res = await api.post("/conversations/", data);
  return res.data;
};

// 📌 Get all messages for a conversation
export const getMessages = async (conversationId) => {
  const res = await api.get(`/conversations/${conversationId}/messages/`);
  return res.data;
};

// 📌 Send a message — backend returns both user_message and assistant_message
export const sendMessage = async (conversationId, content) => {
  const res = await api.post(`/conversations/${conversationId}/messages/`, {
    content,
  });
  return res.data;
};

// 📌 End a conversation
export const endConversation = async (id) => {
  const res = await api.post(`/conversations/${id}/end/`);
  return res.data;
};

// 📌 Abandon a conversation
export const abandonConversation = async (id) => {
  const res = await api.post(`/conversations/${id}/abandon/`);
  return res.data;
};

// 📌 Delete a conversation
export const deleteConversation = async (id) => {
  const res = await api.delete(`/conversations/${id}/`);
  return res.data;
};
