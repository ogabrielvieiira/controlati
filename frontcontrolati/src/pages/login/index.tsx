import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginRequest {
  email: string,
  senha: string
}

interface LoginResponse {
  token: string
}

function Login() {
const navigator = useNavigate();
  const API_URL = "http://localhost:8080/";

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    senha: ''
  });

  const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    
    try {
            
      const response = await axios.post<LoginResponse>(API_URL + "auth/login", formData);

      const token = response.data.token;
      console.log()
      if (token != null) {
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

    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Login</h3>
    
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