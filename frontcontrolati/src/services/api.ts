import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice"; // 1. Importar a ação de logout

const api = axios.create({
  baseURL: 'http://localhost:8080/',
});

// Interceptor de Requisição (Injeta o Token) - JÁ EXISTIA
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

// --- NOVO: Interceptor de Resposta (Trata Erros) ---
api.interceptors.response.use(
    (response) => {
        // Se a resposta for sucesso, apenas a retorna
        return response;
    },
    (error) => {
        // Verifica se o erro é 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada ou token inválido.");
            // Despacha a ação de logout
            store.dispatch(logout());
        }
        // Repassa o erro para que o componente também saiba que falhou
        return Promise.reject(error);
    }
);

export default api;