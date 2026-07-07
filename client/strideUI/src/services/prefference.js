import api from "./api";

export const getPreferences = () =>
  api.get("/auth/me/preferences/").then((res) => res.data);

export const updatePreferences = (data) =>
  api.patch("/auth/me/preferences/", data).then((res) => res.data);
