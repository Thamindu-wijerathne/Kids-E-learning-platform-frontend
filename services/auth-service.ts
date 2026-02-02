import { api } from "../lib/axios";
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};
