import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import equipamentoService from "../services/equipamentoService";

import type { Equipamento, EquipamentoInput } from "../services/equipamentoService";

interface EquipamentoState {
    lista: Equipamento[];
    loading: boolean;
    error: string | null;
}

const initialState: EquipamentoState = {
    lista: [],
    loading: false,
    error: null
};

// --- THUNKS ---

export const fetchEquipamentos = createAsyncThunk('equipamentos/fetch', async () => {
    return await equipamentoService.getAll();
});

export const addEquipamento = createAsyncThunk('equipamentos/add', async (novo: EquipamentoInput) => {
    return await equipamentoService.create(novo);
});

export const updateEquipamento = createAsyncThunk('equipamentos/update', async ({ id, dados }: { id: number, dados: EquipamentoInput }) => {
    return await equipamentoService.update(id, dados);
});

export const deleteEquipamento = createAsyncThunk('equipamentos/delete', async (id: number) => {
    return await equipamentoService.delete(id);
});

// --- SLICE ---
const equipamentoSlice = createSlice({
    name: 'equipamentos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEquipamentos.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchEquipamentos.fulfilled, (state, action) => { state.loading = false; state.lista = action.payload; })
            .addCase(fetchEquipamentos.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Erro ao buscar equipamentos"; })
            
            .addCase(addEquipamento.fulfilled, (state, action) => { state.lista.push(action.payload); })
            
            .addCase(updateEquipamento.fulfilled, (state, action) => {
                const index = state.lista.findIndex(eq => eq.id === action.payload.id);
                if (index !== -1) { state.lista[index] = action.payload; }
            })
            
            .addCase(deleteEquipamento.fulfilled, (state, action) => {
                state.lista = state.lista.filter(eq => eq.id !== action.payload);
            });
    }
});

export default equipamentoSlice.reducer;