import axios, { AxiosRequestConfig } from 'axios';

const httpClient = (() => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.OGMA_API_URL}/api`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    get: async <T>(url: string, config?: AxiosRequestConfig) => {
      const response = await axiosInstance.get<T>(url, config);

      return response.data;
    },

    post: async <T>(url: string, data: any, config?: AxiosRequestConfig) => {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    },
  };
})();

export { httpClient };
