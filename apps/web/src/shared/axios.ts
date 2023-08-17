import Axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEBUG: boolean = Boolean(Number(process.env.NEXT_PUBLIC_DEBUG));

export const axios = Axios.create({
  baseURL: API_URL + "/api",
  validateStatus: (status) => status < 500
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

if (DEBUG) {
  axios.interceptors.request.use(
    (config) => {
      console.debug(
        `[DEBUG] Request (${config.method?.toUpperCase()} ${config.url}): `,
        config
      );
      return config;
    },
    (error) => {
      console.debug(
        `[ERROR] Request (${error.config.method?.toUpperCase()} ${
          error.config.url
        }): `,
        error
      );
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      console.debug(
        `[DEBUG] Response (${response.config.method?.toUpperCase()} ${
          response.config.url
        }): `,
        response
      );
      return response;
    },
    (error) => {
      console.debug(
        `[ERROR] Response (${error.config.method?.toUpperCase()} ${
          error.config.url
        }): `,
        error
      );
      return Promise.reject(error);
    }
  );
}
