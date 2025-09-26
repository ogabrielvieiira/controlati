import axios from "axios";
import React, { useEffect, useState } from "react";

// Interface para o objeto Equipamento
interface Equipamento {
  id: number;
  tipo: string;
  patrimonio: string;
  status: string;
}

// Interface para os dados do formulário (sem o ID)
type EquipamentoFormData = Omit<Equipamento, 'id'>;


function Home() {
    
    const API_URL = "http://localhost:8080/";

    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Estados para o Modal de Edição ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);


    // --- Lógica de Busca de Dados ---
    useEffect(() => {
        const fetchEquipamentos = async () => {
            try {
                const response = await axios.get<Equipamento[]>(API_URL + "equipamentos");
                setEquipamentos(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(`Erro ao carregar equipamentos: Status ${err.response?.status || 'desconhecido'}. Verifique o backend.`);
                } else {
                    setError("Erro de rede. Não foi possível conectar ao servidor.");
                }
                console.error("Erro ao buscar equipamentos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipamentos();
    }, []);

    // --- Funções de Ação (CRUD) ---

    // Abre o modal e define o equipamento a ser editado
    const handleEditClick = (equipamento: Equipamento) => {
        setEditingEquipamento(equipamento);
        setIsModalOpen(true);
    };
    
    // Fecha o modal e limpa o estado
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipamento(null);
    };
    
    // Lida com mudanças nos inputs do formulário do modal
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingEquipamento) {
            const { name, value } = e.target;
            setEditingEquipamento({ ...editingEquipamento, [name]: value });
        }
    };

    // Envia a requisição PUT para atualizar o equipamento
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        if (!editingEquipamento) return;

        // Os dados a serem enviados não precisam do ID no corpo
        const updatedData: EquipamentoFormData = {
            tipo: editingEquipamento.tipo,
            patrimonio: editingEquipamento.patrimonio,
            status: editingEquipamento.status,
        };

        try {
            const response = await axios.put<Equipamento>(`${API_URL}equipamentos/${editingEquipamento.id}`, updatedData);
            
            // Atualiza a lista de equipamentos no estado com os novos dados
            setEquipamentos(equipamentos.map(eq => 
                eq.id === editingEquipamento.id ? response.data : eq
            ));
            
            handleCloseModal(); // Fecha o modal após o sucesso

        } catch (err) {
            console.error("Erro ao atualizar equipamento:", err);
            alert("Não foi possível atualizar o equipamento. Verifique o console.");
        }
    };


    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza de que deseja excluir este equipamento?")) {
            try {
                await axios.delete(`${API_URL}equipamentos/${id}`);
                setEquipamentos(equipamentos.filter(equipamento => equipamento.id !== id));
            } catch (err) {
                console.error("Erro ao deletar equipamento:", err);
                alert("Não foi possível excluir o equipamento. Verifique o console para mais detalhes.");
            }
        }
    };

    // --- Lógica de Renderização ---

    if (loading) {
        return <div className="container text-center mt-5"><p>Carregando lista de equipamentos...</p></div>;
    }

    if (error) {
        return <div className="container mt-5"><div className="alert alert-danger" role="alert">{error}</div></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 text-primary">
                <i className="text-center"></i> Listagem de Equipamentos
            </h1>

            {equipamentos.length === 0 ? (
                <div className="alert alert-info text-center">Não há equipamentos cadastrados no momento.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered shadow-sm align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Patrimônio</th>
                                <th>Status</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipamentos.map((equipamento) => (
                                <tr key={equipamento.id}>
                                    <td>{equipamento.id}</td>
                                    <td>{equipamento.tipo}</td>
                                    <td>{equipamento.patrimonio}</td>
                                    <td>
                                        <span className={`badge bg-${
                                            equipamento.status === 'Disponível' ? 'success' :
                                            equipamento.status === 'Em Uso' ? 'warning text-dark' :
                                            equipamento.status === 'Manutenção' ? 'danger' : 'secondary'
                                        }`}>{equipamento.status}</span>
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(equipamento)} title="Editar">
                                            <i className="bi bi-pencil-fill"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(equipamento.id)} title="Excluir">
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- Modal de Edição --- */}
            {isModalOpen && editingEquipamento && (
                <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Equipamento (ID: {editingEquipamento.id})</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="tipo" className="form-label">Tipo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tipo"
                                            name="tipo"
                                            value={editingEquipamento.tipo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="patrimonio" className="form-label">Patrimônio</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="patrimonio"
                                            name="patrimonio"
                                            value={editingEquipamento.patrimonio}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={editingEquipamento.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Disponível">Disponível</option>
                                            <option value="Em Uso">Em Uso</option>
                                            <option value="Manutenção">Manutenção</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer pb-0">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;