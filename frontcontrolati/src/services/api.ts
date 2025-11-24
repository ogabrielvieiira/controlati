import axios from "axios";
import { logout } from "../redux/authSlice";
// IMPORTANTE: Removemos a importação direta da 'store' para evitar o ciclo

const api = axios.create({
  baseURL: 'http://localhost:8080/',
});

export const setupInterceptors = (store: any) => {
    api.interceptors.request.use(
        (config) => {
            const state = store.getState();
            const token = state.auth.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            };

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Interceptor de Resposta
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response && error.response.status === 401) {
                store.dispatch(logout());
            }
            return Promise.reject(error);
        }
    );
}

export default api;