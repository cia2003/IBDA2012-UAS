import axios from "axios";

const api = () => {
  const api = axios.create({
    baseURL: "http://localhost:4000", // Ganti URL nya nanti
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export default api
