import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/login`, userData);

  if (res.data.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }

  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};
