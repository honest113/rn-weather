import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://api.openweathermap.org/data/2.5",
  baseURL: "https://api.airvisual.com/v2",
  // timeout: 30000,
  // headers: {
  //   "X-Requested-With": "XMLHttpRequest",
  // },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return error.response;
  }
);

export const sendGetAir = (url = "", params) => axiosInstance.get(url, { params }).then((res) => res);
export const sendPost = (url = "", params, queryParams) => axiosInstance
  .post(url, params, { params: queryParams, timeout: queryParams?.timeout })
  .then((res) => res);
export const sendPut = (url = "", params) => axiosInstance.put(url, params).then((res) => res);
export const sendPatch = (url = "", params) => axiosInstance.patch(url, params).then((res) => res);
export const sendDelete = (url = "", params) => axiosInstance.delete(url, { data: params }).then((res) => res);
export const sendCustom = (params = {}) => axiosInstance(params).then((res) => res);
