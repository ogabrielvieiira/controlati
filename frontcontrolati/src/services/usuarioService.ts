import api from "./api";

// --- Definição dos Tipos ---
export interface UsuarioInput {
    nome: string;
    CPF: string;
    email: string;
    senha: string;
    role: string;
}
  
export interface UsuarioResponse {
    id: number;
    nome: string;
    CPF: string;
    email: string;
}

const usuarioService = {
    create: async (novoUsuario: UsuarioInput) => {
        const response = await api.post("usuarios", novoUsuario);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get<UsuarioResponse[]>("usuarios");
        return response.data;
    }
};

export default usuarioService;