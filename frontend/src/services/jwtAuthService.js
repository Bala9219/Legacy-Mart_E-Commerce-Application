import api from "./api";

export const loginWithJwt = async (email, password) => {
  return api.post("/auth/jwt-login", { email, password });
};
