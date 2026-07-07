import api from "./api";

// 📌 Get all goals (optionally filtered by status, e.g. "ACTIVE")
export const getGoals = async (status) => {
  const res = await api.get("/goals/", {
    params: status ? { status } : undefined,
  });
  return res.data;
};

// 📌 Get a single goal
export const getGoal = async (id) => {
  const res = await api.get(`/goals/${id}/`);
  return res.data;
};

// 📌 Create goal
export const createGoal = async (data) => {
  const res = await api.post("/goals/", data);
  return res.data;
};

// 📌 Update goal (partial update — supports nested schedule fields)
export const updateGoal = async (id, data) => {
  const res = await api.patch(`/goals/${id}/`, data);
  return res.data;
};

// 📌 Delete goal
export const deleteGoal = async (id) => {
  const res = await api.delete(`/goals/${id}/`);
  return res.data;
};

// 📌 Pause goal
export const pauseGoal = async (id) => {
  const res = await api.post(`/goals/${id}/pause/`);
  return res.data;
};

// 📌 Resume goal
export const resumeGoal = async (id) => {
  const res = await api.post(`/goals/${id}/resume/`);
  return res.data;
};

// 📌 Archive goal
export const archiveGoal = async (id) => {
  const res = await api.post(`/goals/${id}/archive/`);
  return res.data;
};
