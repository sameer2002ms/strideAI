import api from "./api";

// 📌 Generate a Telegram account-linking token
export const createTelegramLink = async () => {
  const res = await api.post("/channels/telegram/link/");
  return res.data;
};
