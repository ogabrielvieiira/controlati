package com.controlati.controlatiadminconfig.model.DAO;

import com.controlati.controlatiadminconfig.model.Usuario;
import jakarta.persistence.EntityManager;

public class UsuarioDAO {

    private EntityManager entityManager;

    public UsuarioDAO(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    public void salvar(Usuario usuario){
        entityManager.getTransaction().begin();
        entityManager.persist(usuario);
        entityManager.getTransaction().commit();
    }
}