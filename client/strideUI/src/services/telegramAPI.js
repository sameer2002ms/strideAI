import api from "./api";

// 📌 Generate link token
export const generateTelegramToken = async () => {
  const res = await api.post("/channels/telegram/link/");
  return res.data;
};
