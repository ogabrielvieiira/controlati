import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchUsuarios } from "../../redux/usuarioSlice";

function ListaUsuarios() {
    const dispatch = useDispatch<AppDispatch>();
    
    // Pegamos a lista do Redux
    const { lista: usuarios, loading, error } = useSelector((state: RootState) => state.usuarios);

    useEffect(() => {
        dispatch(fetchUsuarios());
    }, [dispatch]);

    if (loading) {
        return <div className="container mt-5 text-center">Carregando usuários...</div>;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    {error} - Verifique se você é Administrador.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4 text-primary">
                <i className="bi bi-people-fill me-2"></i>
                Gestão de Usuários
            </h1>

            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered shadow-sm align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nome}</td>
                                <td>{user.CPF}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                        {usuarios.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center">Nenhum usuário encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListaUsuarios;