import api from "./api";

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
}

export interface CadastroInput {
    nome: string;
    CPF: string;
    email: string;
    senha: string;
    role: string;
}
  
export interface EsqueciSenhaInput {
    email: string;
}
  
export interface RedefinirSenhaInput {
    email: string;
    token: string; 
    senha: string; 
}

const authService = {
    login: async (dados: LoginRequest) => {
        const response = await api.post<LoginResponse>("auth/login", dados);
        return response.data;
    },

    cadastrar: async (dados: CadastroInput) => {
        const response = await api.post("usuarios", dados);
        return response.data;
    },

    solicitarRecuperacao: async (dados: EsqueciSenhaInput) => {
        await api.post("auth/esqueciminhasenha", dados);
    },

    redefinirSenha: async (dados: RedefinirSenhaInput) => {
        await api.post("auth/registrarnovasenha", dados);
    }
};

export default authService;