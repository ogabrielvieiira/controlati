package com.controlati.controlatiadminconfig.controller;

import com.controlati.controlatiadminconfig.Utils.JPAUtils;
import com.controlati.controlatiadminconfig.model.Usuario; // Importa o modelo Usuario
import jakarta.persistence.EntityManager;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField; // Importa PasswordField
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.time.LocalDateTime; // Importa LocalDateTime

public class ConfigAdminController {

    // Mapeia os campos do configadmin-view.fxml
    @FXML private TextField txtNome;
    @FXML private TextField txtCpf;
    @FXML private TextField txtEmail;
    @FXML private PasswordField txtSenha;

    /**
     * Este método salva o primeiro usuário Administrador no banco de dados.
     */
    @FXML
    public void salvarAdministrador(ActionEvent event) {
        String nome = txtNome.getText();
        String cpf = txtCpf.getText();
        String email = txtEmail.getText();
        String senha = txtSenha.getText();

        // Validação simples
        if (nome == null || nome.trim().isEmpty() ||
                cpf == null || cpf.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                senha == null || senha.trim().isEmpty()) {

            showAlert(Alert.AlertType.ERROR, "Erro de Validação", "Todos os campos são obrigatórios!");
            return;
        }

        EntityManager entityManager = null;
        try {
            // Criar a entidade Usuario
            Usuario admin = new Usuario();
            admin.setNome(nome);
            admin.setCPF(cpf);
            admin.setEmail(email);
            admin.setSenha(senha); // No seu backend, esta senha será usada para login

            // Definir a ROLE e a data (crucial para o requisito)
            admin.setRole("ROLE_ADMIN");
            admin.setDataCadastro(LocalDateTime.now());

            // Salvar no banco de dados
            entityManager = JPAUtils.getEntityManager(); //
            entityManager.getTransaction().begin();
            entityManager.persist(admin);
            entityManager.getTransaction().commit();

            showAlert(Alert.AlertType.INFORMATION, "Sucesso", "Administrador '" + nome + "' criado com sucesso!\nJá pode fazer login na aplicação web.");

            // Opcional: Limpar campos após salvar
            txtNome.clear();
            txtCpf.clear();
            txtEmail.clear();
            txtSenha.clear();

        } catch (Exception e) {
            // Se algo der errado (ex: CPF/Email duplicado), desfaz a transação
            if (entityManager != null && entityManager.getTransaction().isActive()) {
                entityManager.getTransaction().rollback();
            }
            e.printStackTrace(); // Mostra o erro completo no console
            showAlert(Alert.AlertType.ERROR, "Erro ao Salvar", "Ocorreu um erro ao salvar:\n" + e.getMessage());
        } finally {
            if (entityManager != null) {
                entityManager.close();
            }
        }
    }

    /**
     * Método para voltar ao menu principal.
     */
    @FXML
    public void voltar(ActionEvent event) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/controlati/controlatiadminconfig/menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    /**
     * Método auxiliar para mostrar alertas.
     */
    private void showAlert(Alert.AlertType alertType, String title, String message) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}