import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Tipagem do Equipamento
export interface Equipamento {
    id: number;
    tipo: string;
    patrimonio: string;
    status: string;
}

// Tipagem para criar/editar (sem ID)
export interface EquipamentoInput {
    tipo: string;
    patrimonio: string;
    status: string;
}

// Estado do Slice
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

// --- THUNKS (Chamadas à API) ---

// Buscar Todos
export const fetchEquipamentos = createAsyncThunk('equipamentos/fetch', async () => {
    const response = await api.get<Equipamento[]>('equipamentos');
    return response.data;
});

// Adicionar
export const addEquipamento = createAsyncThunk('equipamentos/add', async (novo: EquipamentoInput) => {
    const response = await api.post<Equipamento>('equipamentos', novo);
    return response.data;
});

// Atualizar
export const updateEquipamento = createAsyncThunk('equipamentos/update', async ({ id, dados }: { id: number, dados: EquipamentoInput }) => {
    const response = await api.put<Equipamento>(`equipamentos/${id}`, dados);
    return response.data;
});

// Remover
export const deleteEquipamento = createAsyncThunk('equipamentos/delete', async (id: number) => {
    await api.delete(`equipamentos/${id}`);
    return id;
});

// --- SLICE ---
const equipamentoSlice = createSlice({
    name: 'equipamentos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchEquipamentos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEquipamentos.fulfilled, (state, action) => {
                state.loading = false;
                state.lista = action.payload;
            })
            .addCase(fetchEquipamentos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Erro ao buscar equipamentos";
            })
            // Add
            .addCase(addEquipamento.fulfilled, (state, action) => {
                state.lista.push(action.payload);
            })
            // Update
            .addCase(updateEquipamento.fulfilled, (state, action) => {
                const index = state.lista.findIndex(eq => eq.id === action.payload.id);
                if (index !== -1) {
                    state.lista[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteEquipamento.fulfilled, (state, action) => {
                state.lista = state.lista.filter(eq => eq.id !== action.payload);
            });
    }
});

export default equipamentoSlice.reducer;