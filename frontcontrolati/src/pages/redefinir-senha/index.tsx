import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { redefinirSenha, type RedefinirSenhaInput } from "../../redux/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";

function RedefinirSenha() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    // Tenta pegar o email vindo da navegação anterior, ou vazio
    const emailInicial = location.state?.email || "";

    const [formData, setFormData] = useState({
        email: emailInicial,
        token: '',
        senha: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.token || !formData.senha) {
            alert("Preencha todos os campos.");
            return;
        }

        const dados: RedefinirSenhaInput = {
            email: formData.email,
            token: formData.token,
            senha: formData.senha
        };

        try {
            await dispatch(redefinirSenha(dados)).unwrap();
            alert("Senha redefinida com sucesso! Faça login com a nova senha.");
            navigate("/login");
        } catch (err) {
            console.error("Erro ao redefinir:", err);
        }
    };

    return (
        <>
            <h3 className="text-center mb-4">Redefinir Senha</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Código Recebido</label>
                    <input 
                        type="text" 
                        name="token"
                        className="form-control" 
                        placeholder="Digite o código"
                        value={formData.token}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nova Senha</label>
                    <input 
                        type="password" 
                        name="senha"
                        className="form-control" 
                        placeholder="Crie uma nova senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Nova Senha"}
                </button>
            </form>

            <div className="text-center mt-3">
                <Link to="/login">Cancelar</Link>
            </div>
        </>
    );
}

export default RedefinirSenha;