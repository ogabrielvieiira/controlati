import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usuarioService from "../services/usuarioService";

import type { UsuarioInput, UsuarioResponse } from "../services/usuarioService";

interface UsuarioState {
  lista: UsuarioResponse[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UsuarioState = {
  lista: [],
  loading: false,
  error: null,
  success: false
};

// --- THUNKS ---

export const addUsuario = createAsyncThunk(
    'usuarios/add', 
    async (novoUsuario: UsuarioInput) => {
        return await usuarioService.create(novoUsuario);
    }
);

export const fetchUsuarios = createAsyncThunk(
    'usuarios/fetchAll',
    async () => {
        return await usuarioService.getAll();
    }
);

const usuarioSlice = createSlice({
    name: 'usuarios',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUsuario.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(addUsuario.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(addUsuario.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Erro ao criar usuário"; })
            
            .addCase(fetchUsuarios.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUsuarios.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
            .addCase(fetchUsuarios.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Erro ao buscar usuários (Acesso Negado?)"; });
    }
});

export const { resetStatus } = usuarioSlice.actions;
export default usuarioSlice.reducer;