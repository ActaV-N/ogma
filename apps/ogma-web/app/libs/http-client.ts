import axios, { AxiosRequestConfig } from 'axios';

const httpClient = (() => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return {
        get: async <T>(url: string, config?: AxiosRequestConfig) => {
          const response = await axiosInstance.get<T>(url, config);

          return response.data;
        },

    }
})();

export { httpClient };
