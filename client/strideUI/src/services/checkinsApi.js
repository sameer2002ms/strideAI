import api from "./api";

// 📌 Get today's check-ins
export const getTodayCheckins = async () => {
  const res = await api.get("/checkins/today/");
  return res.data;
};

// 📌 Update check-in status
export const updateCheckin = async (id, status) => {
  const res = await api.patch(`/checkins/${id}/`, {
    status, // complete | miss | skip
  });
  return res.data;
};

// 📌 Get history (optional later UI)
export const getCheckinHistory = async () => {
  const res = await api.get("/checkins/history/");
  return res.data;
};
