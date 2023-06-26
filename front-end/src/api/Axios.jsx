import axios from "axios";
import { Cookies } from "react-cookie";

export const instance = (token) => {
  if (!token) {
    token = "";
  }
  const defaultOptions = {
    baseURL: import.meta.env.VITE_End_Point,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  let instance = axios.create(defaultOptions);
  instance.interceptors.response.use(
    (response) => response,
    (error) => error.response
  );
  return instance;
};
