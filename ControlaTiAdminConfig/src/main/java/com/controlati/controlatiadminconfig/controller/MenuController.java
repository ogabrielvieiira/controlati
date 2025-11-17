package com.controlati.controlatiadminconfig.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.stage.Stage;

import java.io.IOException;

public class MenuController {

    public void sair() {
        System.exit(0);
    }

    // Este método abrirá a tela de criação de admin
    @FXML
    public void abrirConfigAdmin(ActionEvent event) throws Exception {
        // Aponta para configadmin-view.fxml
        abrirJanela(event, "/com/controlati/controlatiadminconfig/configadmin-view.fxml");
    }

    // Este método abrirá a tela de exemplo do CEP
    @FXML
    public void abrirExemploCep(ActionEvent event) throws Exception {
        // Aponta para exemplo-view.fxml
        abrirJanela(event, "/com/controlati/controlatiadminconfig/exemplo-view.fxml");
    }

    // Método auxiliar para evitar repetição de código
    private void abrirJanela(ActionEvent event, String fxmlPath) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource(fxmlPath));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }
}