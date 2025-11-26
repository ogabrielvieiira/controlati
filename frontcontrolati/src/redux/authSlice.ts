import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../services/api";

// Tipos existentes
interface Usuario {
  email: string;
  nome: string;
}

interface AuthState {
  isAutenticado: boolean;
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface CadastroInput {
  nome: string;
  CPF: string;
  email: string;
  senha: string;
  role: string;
}

// --- NOVOS TIPOS PARA RECUPERAÇÃO ---
export interface EsqueciSenhaInput {
    email: string;
}

export interface RedefinirSenhaInput {
    email: string;
    token: string; // O código recebido por email
    senha: string; // A nova senha
}

const initialState: AuthState = {
  isAutenticado: false,
  usuario: null,
  token: null,
  loading: false,
  error: null
};

// --- THUNKS ---

export const cadastrarUsuario = createAsyncThunk(
  'auth/cadastrar',
  async (dados: CadastroInput) => {
    const response = await api.post("usuarios", dados);
    return response.data;
  }
);

// NOVO: Solicitar envio de e-mail
export const solicitarRecuperacao = createAsyncThunk(
    'auth/solicitarRecuperacao',
    async (dados: EsqueciSenhaInput) => {
        // Endpoint: /auth/esqueciminhasenha
        await api.post("auth/esqueciminhasenha", dados);
        return; // Não retorna dados, apenas 200 OK
    }
);

// NOVO: Enviar nova senha com o token
export const redefinirSenha = createAsyncThunk(
    'auth/redefinirSenha',
    async (dados: RedefinirSenhaInput) => {
        // Endpoint: /auth/registrarnovasenha
        await api.post("auth/registrarnovasenha", dados);
        return;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSucesso: (state, action : PayloadAction<{usuario: Usuario, token: string}>) => {
            state.isAutenticado = true;
            state.token = action.payload.token;
            state.usuario = action.payload.usuario;
            state.error = null;
        },
        logout: (state) => {
            state.isAutenticado = false;
            state.token = null;
            state.usuario = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
      builder
        // Cadastro
        .addCase(cadastrarUsuario.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(cadastrarUsuario.fulfilled, (state) => { state.loading = false; })
        .addCase(cadastrarUsuario.rejected, (state, action) => { 
            state.loading = false; 
            state.error = action.error.message || "Erro ao cadastrar"; 
        })
        // Solicitar Recuperação
        .addCase(solicitarRecuperacao.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(solicitarRecuperacao.fulfilled, (state) => { state.loading = false; })
        .addCase(solicitarRecuperacao.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Erro ao solicitar recuperação";
        })
        // Redefinir Senha
        .addCase(redefinirSenha.pending, (state) => { state.loading = true; state.error = null; })
        .addCase(redefinirSenha.fulfilled, (state) => { state.loading = false; })
        .addCase(redefinirSenha.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "Erro ao redefinir senha";
        });
    }
});

export const { loginSucesso, logout } = authSlice.actions;
export default authSlice.reducer;