import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import authService from "../services/authService";
import type { 
    CadastroInput, 
    EsqueciSenhaInput, 
    RedefinirSenhaInput 
} from "../services/authService";

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


export type { CadastroInput, EsqueciSenhaInput, RedefinirSenhaInput };

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
    return await authService.cadastrar(dados);
  }
);

export const solicitarRecuperacao = createAsyncThunk(
    'auth/solicitarRecuperacao',
    async (dados: EsqueciSenhaInput) => {
        return await authService.solicitarRecuperacao(dados);
    }
);

export const redefinirSenha = createAsyncThunk(
    'auth/redefinirSenha',
    async (dados: RedefinirSenhaInput) => {
        return await authService.redefinirSenha(dados);
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