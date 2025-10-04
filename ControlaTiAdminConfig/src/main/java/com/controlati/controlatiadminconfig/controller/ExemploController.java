package com.controlati.controlatiadminconfig.controller;

import com.controlati.controlatiadminconfig.Utils.JPAUtils;
import com.controlati.controlatiadminconfig.model.DAO.EnderecoDAO;
import com.controlati.controlatiadminconfig.model.Endereco;
import jakarta.persistence.EntityManager;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class ExemploController {

    @FXML
    private TextArea txtEndereco;

    @FXML
    private TextField txtCep;

    public void consultarCep(ActionEvent event){
        try {
            var urlEndereco = "https://viacep.com.br/ws/"+txtCep.getText()+"/json/"; // pode ser url da api
            URL url = new URL(urlEndereco);
            HttpURLConnection conm = (HttpURLConnection) url.openConnection();
            conm.setRequestMethod("GET"); // será post no projeto, por conta que vamos criar um admin
            conm.setDoOutput(true);
            conm.setRequestProperty("Content-Type","application/json");

//        String json = String.format("{\"email\":\"%s\",\"email\":\"%s\"}", txtCep.getText(),txtEndereco.getText());
//
//        try (OutputStream os = conm.getOutputStream()){
//                os.write(json.getBytes());
//    }

            int status = conm.getResponseCode();
            if (status == 200){
                BufferedReader in = new BufferedReader(new InputStreamReader(conm.getInputStream()));
                String inputLine;
                StringBuilder response = new StringBuilder();
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                txtEndereco.setText(conm.getResponseMessage());

                salvarEndereco(response.toString(),txtCep.getText());

            }
            conm.disconnect();

        } catch (Exception e){

        }

        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Dados Digitados!");
        alert.setHeaderText(null);
        alert.setContentText("Cep" + txtCep.getText());


        alert.showAndWait();
    }

    public void voltar(ActionEvent event) throws Exception{
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/controlati/controlatiadminconfig/menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    private boolean salvarEndereco(String endereco, String cep){
        try {
            EntityManager entityManager = JPAUtils.getEntityManager();

            EnderecoDAO enderecoDAO = new EnderecoDAO(entityManager);

            Endereco enderecoBanco = new Endereco();
            enderecoBanco.setEndereco(endereco);
            enderecoBanco.setCep(cep);

            enderecoDAO.salvar(enderecoBanco);

            return true;
        } catch (Exception e){
            return false;
        }
    }

}
