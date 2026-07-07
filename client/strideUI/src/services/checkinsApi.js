import api from "./api";

// 📌 List all check-ins
export const getCheckins = async () => {
  const res = await api.get("/checkins/");
  return res.data;
};

// 📌 Get a single check-in's details
export const getCheckin = async (id) => {
  const res = await api.get(`/checkins/${id}/`);
  return res.data;
};

// 📌 Create a check-in
export const createCheckin = async (data) => {
  const res = await api.post("/checkins/", data);
  return res.data;
};

// 📌 Delete a check-in
export const deleteCheckin = async (id) => {
  const res = await api.delete(`/checkins/${id}/`);
  return res.data;
};

// 📌 Mark a check-in complete
export const completeCheckin = async (id) => {
  const res = await api.post(`/checkins/${id}/complete/`);
  return res.data;
};

// 📌 Mark a check-in missed
export const missCheckin = async (id) => {
  const res = await api.post(`/checkins/${id}/miss/`);
  return res.data;
};

// 📌 Mark a check-in skipped
export const skipCheckin = async (id) => {
  const res = await api.post(`/checkins/${id}/skip/`);
  return res.data;
};
