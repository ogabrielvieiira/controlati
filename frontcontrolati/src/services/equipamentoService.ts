import api from "./api";

// --- Definição dos Tipos ---
export interface Equipamento {
    id: number;
    tipo: string;
    patrimonio: string;
    status: string;
}

export interface EquipamentoInput {
    tipo: string;
    patrimonio: string;
    status: string;
}

const equipamentoService = {
    getAll: async () => {
        const response = await api.get<Equipamento[]>('equipamentos');
        return response.data;
    },

    create: async (novo: EquipamentoInput) => {
        const response = await api.post<Equipamento>('equipamentos', novo);
        return response.data;
    },

    update: async (id: number, dados: EquipamentoInput) => {
        const response = await api.put<Equipamento>(`equipamentos/${id}`, dados);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`equipamentos/${id}`);
        return id;
    }
};

export default equipamentoService;