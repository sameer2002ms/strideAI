import api from "./api";

export const getProfile = () =>
  api.get("/auth/me/profile/").then((res) => res.data);

export const updateProfile = (data) =>
  api.patch("/auth/me/profile/", data).then((res) => res.data);
