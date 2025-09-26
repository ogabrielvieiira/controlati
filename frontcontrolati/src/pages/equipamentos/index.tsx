import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Interface para os dados do formulário de cadastro
interface EquipamentoFormData {
  tipo: string;
  patrimonio: string;
  status: string;
}

function Equipamentos() {
  const API_URL = "http://localhost:8080/";
  const navigate = useNavigate();

  // Estado inicial do formulário
  const initialState: EquipamentoFormData = {
    tipo: '',
    patrimonio: '',
    status: 'Disponível'
  };

  const [formData, setFormData] = useState<EquipamentoFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await axios.post(API_URL + "equipamentos", formData);
      setSuccessMessage("Equipamento cadastrado com sucesso!");
      
      setTimeout(() => {
        navigate('/');
      }, 100);

    } catch (err) {
      setErrorMessage("Erro ao cadastrar equipamento. Verifique os dados ou o servidor.");
      console.error("Erro no cadastro:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="text-center mb-4 text-primary">
                <i className="text-center"></i>
                Cadastrar Novo Equipamento
              </h1>

              {/* Alertas de Feedback */}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <form onSubmit={handleSubmit}>
                {/* Campo Tipo */}
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    placeholder="Tipo do equipamento"
                    required
                  />
                </div>

                {/* Campo Patrimônio */}
                <div className="mb-3">
                  <label htmlFor="patrimonio" className="form-label">Patrimônio</label>
                  <input
                    type="text"
                    className="form-control"
                    id="patrimonio"
                    name="patrimonio"
                    value={formData.patrimonio}
                    onChange={handleInputChange}
                    placeholder="Código do patrimônio"
                    required
                  />
                </div>

                {/* Campo Status */}
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Em Uso">Em Uso</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

                {/* Botão de Envio */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Cadastrando...
                      </>
                    ) : (
                      'Cadastrar Equipamento'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Equipamentos;