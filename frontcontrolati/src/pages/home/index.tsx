import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../redux/store";

import { 
    fetchEquipamentos, 
    updateEquipamento, 
    deleteEquipamento, 
    type Equipamento, 
    type EquipamentoInput 
} from "../../redux/equipamentoSlice";

function Home() {
    const dispatch = useDispatch<AppDispatch>();
    
    const { lista: equipamentos, loading, error } = useSelector((state: RootState) => state.equipamentos);

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);

    useEffect(() => {
        dispatch(fetchEquipamentos());
    }, [dispatch]);

    const equipamentosFiltrados = equipamentos.filter(eq => 
        eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.patrimonio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.id.toString().includes(searchTerm)
    );

    // --- NOVA FUNÇÃO: Alterar Status (Atribuir/Devolver) ---
    const handleStatusChange = async (equipamento: Equipamento, novoStatus: string) => {
        // Prepara os dados mantendo tipo/patrimônio e mudando só o status
        const updatedData: EquipamentoInput = {
            tipo: equipamento.tipo,
            patrimonio: equipamento.patrimonio,
            status: novoStatus,
        };

        // Dispara a ação de atualização
        await dispatch(updateEquipamento({ id: equipamento.id, dados: updatedData }));
    };

    // --- Handlers Existentes ---
    const handleEditClick = (equipamento: Equipamento) => {
        setEditingEquipamento(equipamento);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEquipamento(null);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingEquipamento) {
            const { name, value } = e.target;
            setEditingEquipamento({ ...editingEquipamento, [name]: value });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEquipamento) return;

        const updatedData: EquipamentoInput = {
            tipo: editingEquipamento.tipo,
            patrimonio: editingEquipamento.patrimonio,
            status: editingEquipamento.status,
        };

        await dispatch(updateEquipamento({ id: editingEquipamento.id, dados: updatedData }));
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Tem certeza de que deseja excluir este equipamento?")) {
            dispatch(deleteEquipamento(id));
        }
    };

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

            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0" 
                            placeholder="Pesquisar por ID, tipo, patrimônio..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {equipamentosFiltrados.length === 0 ? (
                <div className="alert alert-info text-center">
                    {searchTerm ? "Nenhum equipamento encontrado para a pesquisa." : "Não há equipamentos cadastrados."}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered shadow-sm align-middle" style={{ tableLayout: 'fixed' }}>
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Patrimônio</th>
                                <th>Status</th>
                                <th className="text-center" style={{ width: '250px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipamentosFiltrados.map((equipamento) => (
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
                                        {/* BOTÕES CONDICIONAIS (REGRA DE NEGÓCIO) */}
                                        {equipamento.status === 'Disponível' && (
                                            <button 
                                                className="btn btn-success btn-sm me-2" 
                                                onClick={() => handleStatusChange(equipamento, 'Em Uso')}
                                                title="Atribuir Equipamento"
                                            >
                                                <i className="bi bi-person-check-fill me-1"></i>
                                            </button>
                                        )}
                                        
                                        {equipamento.status === 'Em Uso' && (
                                            <button 
                                                className="btn btn-info btn-sm me-2 text-white" 
                                                onClick={() => handleStatusChange(equipamento, 'Disponível')}
                                                title="Devolver Equipamento"
                                            >
                                                <i className="bi bi-box-arrow-in-left me-1"></i>
                                            </button>
                                        )}

                                        {/* Botões de Manutenção (Editar/Excluir) */}
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
                                        <input type="text" className="form-control" id="tipo" name="tipo"
                                            value={editingEquipamento.tipo} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="patrimonio" className="form-label">Patrimônio</label>
                                        <input type="text" className="form-control" id="patrimonio" name="patrimonio"
                                            value={editingEquipamento.patrimonio} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Status</label>
                                        <select className="form-select" id="status" name="status"
                                            value={editingEquipamento.status} onChange={handleInputChange} required>
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