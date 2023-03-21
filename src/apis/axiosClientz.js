import axios from "axios";
import store from "../store";

const axiosClientz = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn/api/",
  headers: {
    TokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCAzMiIsIkhldEhhblN0cmluZyI6IjE1LzA0LzIwMjMiLCJIZXRIYW5UaW1lIjoiMTY4MTUxNjgwMDAwMCIsIm5iZiI6MTY1MzkzMDAwMCwiZXhwIjoxNjgxNjY0NDAwfQ.oR9K8iSTqbo-t0Q_a-WFnKePPaMAr7sdlgR5xKAtQWA",
  },
});

axiosClientz.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth.user || {};

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClientz.interceptors.response.use(
  (response) => {
    return response.data.content;
  },

  (error) => {
    return Promise.reject(error.response?.data?.message);
  }
);

export default axiosClientz;
