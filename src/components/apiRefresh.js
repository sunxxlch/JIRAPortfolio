import axios from "axios";

const api = axios.create({
  baseURL: "http://10.203.48.66:8080",
});

// Request Interceptor: Attach access token to every request
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry and Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status===401 || error.response.status===403) {
        
      const rToken = localStorage.getItem("refreshToken");
      const bd = {
        refreshToken: rToken
      };

      if (rToken) {
        
        try {
          const res = await axios.post(`http://10.203.48.66:8080/refresh`,  bd );
          if (res.status === 200) {
            console.log("Token refreshed successfully!");
            localStorage.removeItem("accessToken");
            localStorage.setItem("accessToken", res.data.accessToken);
            error.config.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
            return axios(error.config);
          }
        } catch (refreshError) {
          console.error("Refresh token expired or invalid:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          window.location.href = "/login"; 
        }
      } else {
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
