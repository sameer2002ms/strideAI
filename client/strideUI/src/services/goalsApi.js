import api from "./api";

// 📌 Get all goals
export const getGoals = async () => {
  const res = await api.get("/goals/");
  return res.data;
};

// 📌 Create goal
export const createGoal = async (data) => {
  const res = await api.post("/goals/", data);
  return res.data;
};

// 📌 Update goal
export const updateGoal = async (id, data) => {
  const res = await api.put(`/goals/${id}/`, data);
  return res.data;
};

// 📌 Delete goal
export const deleteGoal = async (id) => {
  const res = await api.delete(`/goals/${id}/`);
  return res.data;
};
