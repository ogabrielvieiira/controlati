import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSucesso } from "../../redux/authSlice";
import authService from "../../services/authService"; 
// MUDANÇA AQUI: Usar 'import type' para interfaces
import type { LoginRequest } from "../../services/authService";

function Login() {
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    senha: ''
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    setErrorMessage(null); 
  };

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const data = await authService.login(formData);

      if (data.token) {
        dispatch(loginSucesso({
          usuario: {email: formData.email, nome: ""},
          token: data.token
        }));

        navigator("/")
      }

    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403 || error.response.status === 400) {
          setErrorMessage("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else {
          setErrorMessage("Ocorreu um erro inesperado ao tentar fazer login. Tente novamente mais tarde.");
        }
      } else { 
          console.error("Erro de login:", error);
          setErrorMessage("Erro de conexão com o servidor.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Login</h3>
        {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input 
          name="email"
          type="text"
          className="form-control"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail" 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input 
          name="senha"
          type="password" 
          className="form-control"
          id="senha"
          value={formData.senha}
          onChange={handleChange} 
          placeholder="Digite sua senha" 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Entrar</button>

      <div className="mb-3 text-end">
            <Link to="/recuperar-senha" style={{ fontSize: '0.9rem' }}>
                Esqueceu a senha?
            </Link>
        </div>
    </form>
  );
}

export default Login;