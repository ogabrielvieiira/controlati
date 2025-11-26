import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUsuario, resetStatus, type UsuarioInput } from "../../redux/usuarioSlice";
import type { AppDispatch, RootState } from "../../redux/store";

function Usuario() {
    const dispatch = useDispatch<AppDispatch>();
    
    // Ler estado do slice de usuários
    const { loading, error, success } = useSelector((state: RootState) => state.usuarios);

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        role: 'ROLE_USER'
    });

    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

    // Efeito para limpar o formulário em caso de sucesso
    useEffect(() => {
        if (success) {
            setFeedbackMsg("Usuário cadastrado com sucesso!");
            setFormData({ nome: '', cpf: '', email: '', senha: '', role: 'ROLE_USER' });
            dispatch(resetStatus()); // Reseta o status para permitir novos cadastros
            
            // Limpa a mensagem após 3 segundos
            setTimeout(() => setFeedbackMsg(null), 3000);
        }
    }, [success, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackMsg(null);

        const novoUsuario: UsuarioInput = {
            nome: formData.nome,
            CPF: formData.cpf,
            email: formData.email,
            senha: formData.senha,
            role: formData.role
        };

        // Dispara o Thunk (token vai automático)
        dispatch(addUsuario(novoUsuario));
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4 text-primary">
                                <i className="bi bi-person-plus-fill me-2"></i>
                                Novo Usuário
                            </h2>

                            {/* Mensagens de Feedback */}
                            {feedbackMsg && <div className="alert alert-success">{feedbackMsg}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nome Completo</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        className="form-control"
                                        placeholder="Digite o nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">CPF</label>
                                    <input
                                        type="text"
                                        name="cpf"
                                        className="form-control"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="exemplo@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Senha</label>
                                    <input
                                        type="password"
                                        name="senha"
                                        className="form-control"
                                        placeholder="Crie uma senha forte"
                                        value={formData.senha}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Perfil de Acesso</label>
                                    <select 
                                        name="role" 
                                        className="form-select" 
                                        value={formData.role} 
                                        onChange={handleChange}
                                    >
                                        <option value="ROLE_USER">Usuário Comum</option>
                                        <option value="ROLE_ADMIN">Administrador</option>
                                    </select>
                                </div>

                                <div className="d-grid gap-2 mt-4">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Cadastrando...
                                            </>
                                        ) : (
                                            "Cadastrar Usuário"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Usuario;