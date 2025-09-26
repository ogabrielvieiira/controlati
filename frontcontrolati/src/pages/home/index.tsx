import axios from "axios";
import { useEffect, useState } from "react";

// Interface para o objeto Equipamento
interface Equipamento {
  id: number;
  tipo: string;
  patrimonio: string;
  status: string;
}

function Home() {
    
    const API_URL = "http://localhost:8080/";

    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEquipamentos = async () => {
            try {
                const response = await axios.get<Equipamento[]>(API_URL + "equipamentos");
                
                setEquipamentos(response.data);
                setLoading(false);

            } catch (err) {
                setLoading(false);
                if (axios.isAxiosError(err)) {
                    setError(`Erro ao carregar equipamentos: Status ${err.response?.status || 'desconhecido'}. Verifique o backend.`);
                } else {
                    setError("Erro de rede. Não foi possível conectar ao servidor.");
                }
                console.error("Erro ao buscar equipamentos:", err);
            }
        };

        fetchEquipamentos();
    }, []);

    // --- Lógica de Renderização Condicional ---

    if (loading) {
        return (
            // Classe para centralizar e dar margem
            <div className="container text-center mt-5">
                <p>Carregando lista de equipamentos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">{error}</div>
            </div>
        );
    }

    // --- Renderização Principal (Tabela) ---
    return (
        // Container principal com margem superior
        <div className="container mt-4">
            <h1 className="text-center mb-4 text-primary">
                <i className="bi bi-gear-fill me-2"></i> {/* Ícone Bootstrap Icons (se você os tiver importado) */}
                Listagem de Equipamentos
            </h1>

            {equipamentos.length === 0 ? (
                // Alerta de informação do Bootstrap
                <div className="alert alert-info text-center">
                    Não há equipamentos cadastrados no momento.
                </div>
            ) : (
                // Tabela estilizada
                <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered shadow-sm">
                        {/* Cabeçalho da Tabela */}
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Patrimônio</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        
                        {/* Corpo da Tabela */}
                        <tbody>
                            {equipamentos.map((equipamento) => (
                                <tr key={equipamento.id}>
                                    <td>{equipamento.id}</td>
                                    <td>{equipamento.tipo}</td>
                                    <td>{equipamento.patrimonio}</td>
                                    <td>
                                        {/* Badge (tag) para o Status */}
                                        <span className={`badge bg-${
                                            equipamento.status === 'Disponível' ? 'success' :
                                            equipamento.status === 'Em Uso' ? 'warning text-dark' :
                                            equipamento.status === 'Manutenção' ? 'danger' :
                                            'secondary'
                                        }`}>
                                            {equipamento.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Home;