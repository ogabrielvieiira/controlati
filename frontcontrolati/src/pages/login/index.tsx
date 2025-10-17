import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSucesso } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

interface LoginRequest {
  email: string,
  senha: string
}

interface LoginResponse {
  token: string
}

function Login() {
const navigator = useNavigate();
const dispatch = useDispatch();


  const API_URL = "http://localhost:8080/";

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
            
      const response = await axios.post<LoginResponse>(API_URL + "auth/login", formData);

      const token = response.data.token;
      console.log()
      if (token != null) {

        dispatch(loginSucesso({
          usuario: {email: formData.email, nome: ""},
          token: token
        }));

        navigator("/")
      }
      // Exemplo de Fetch
      // const response = await fetch(API_URL + "auth/login",{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(formData)
      // });

      // if (response.ok) {
      //   throw new Error("Erro ao fazer login");
      // }

      // const data: LoginResponse = await response.json();
      // console.log(data.token);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        
        if (error.response.status === 401 || error.response.status === 403 || error.response.status === 400) {
          setErrorMessage("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else {
          setErrorMessage("Ocorreu um erro inesperado ao tentar fazer login. Tente novamente mais tarde.");
        }
      }  
      console.error("Erro de login:", error);
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

      <div className="text-center mt-3">
        <span>Não tem conta? </span>
        <Link to="/cadastro">Cadastre-se</Link>
      </div>
    </form>
  );
}

export default Login;