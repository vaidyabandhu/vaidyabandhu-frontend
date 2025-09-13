import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://52.66.199.115:8000/api/`,
  headers: {
    // 'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("authToken"); // Get the token from localStorage

    config.headers["Authorization"] = `${token}`; // Attach token to Authorization header
    if (config.data instanceof FormData) {
      // Axios automatically sets the appropriate Content-Type for FormData, but we will ensure it's set
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      // Default content type for JSON requests
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // eslint-disable-next-line no-console
    console.log("error", error);

    const { response } = error;
    if (response?.status === 401) {
      // eslint-disable-next-line no-console
      console.warn("Token expired, logging out...");
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
