import axios from "axios";

const API = "http://172.25.246.95:5000/api/auth";


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
