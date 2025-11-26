import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { solicitarRecuperacao } from "../../redux/authSlice";
import type { AppDispatch, RootState } from "../../redux/store";

function RecuperarSenha() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            await dispatch(solicitarRecuperacao({ email })).unwrap();
            alert("Se o e-mail existir, um código de verificação foi enviado.");
            // Redireciona para a tela de digitar o código, levando o email junto
            navigate("/redefinir-senha", { state: { email } }); 
        } catch (err) {
            console.error("Erro ao solicitar:", err);
        }
    };

    return (
        <>
            <h3 className="text-center mb-4">Recuperar Senha</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <p className="text-muted text-center small">
                Informe seu e-mail para receber o código de verificação.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Código"}
                </button>
            </form>

            <div className="text-center mt-3">
                <Link to="/login">Voltar ao Login</Link>
            </div>
        </>
    );
}

export default RecuperarSenha;