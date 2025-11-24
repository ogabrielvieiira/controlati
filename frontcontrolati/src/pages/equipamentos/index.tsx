import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addEquipamento, type EquipamentoInput } from '../../redux/equipamentoSlice';
import type { AppDispatch } from '../../redux/store';

interface EquipamentoFormData {
  tipo: string;
  patrimonio: string;
  status: string;
}

function Equipamentos() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // Setup do dispatch

  const initialState: EquipamentoFormData = {
    tipo: '',
    patrimonio: '',
    status: 'Disponível'
  };

  const [formData, setFormData] = useState<EquipamentoFormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const novoEquipamento: EquipamentoInput = {
        tipo: formData.tipo,
        patrimonio: formData.patrimonio,
        status: formData.status
    };

    try {
      // MUDANÇA: Usamos o Redux para adicionar!
      // O unwrap() permite pegar o erro ou sucesso da Promise do Redux
      await dispatch(addEquipamento(novoEquipamento)).unwrap();
      
      setSuccessMessage("Equipamento cadastrado com sucesso!");
      
      setTimeout(() => {
        navigate('/');
      }, 1000); // Um tempinho para ler a mensagem

    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao cadastrar equipamento.");
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

              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

              <form onSubmit={handleSubmit}>
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

                <div className="mb-3">
                  <label htmlFor="patrimonio" className="form-label">Patrimônio</label>
                  <input
                    type="text"
                    className="form-control"
                    id="patrimonio"
                    name="patrimonio"
                    value={formData.patrimonio}
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
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Em Uso">Em Uso</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

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