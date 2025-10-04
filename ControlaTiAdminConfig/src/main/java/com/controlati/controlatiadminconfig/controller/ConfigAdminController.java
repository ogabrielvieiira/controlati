package com.controlati.controlatiadminconfig.controller;

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
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class ConfigAdminController {

    @FXML
    private TextArea txtEndereco;

    @FXML
    private TextField txtCep;

    public void consultarCep(ActionEvent event){
    try {
        var urlEndereco = "https://viacep.com.br/ws/"+txtCep.getText()+"/json/";
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
    }
    conm.disconnect();

} catch (Exception e){

}

        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle("Dados Digitados!");
        alert.setHeaderText(null);
        alert.setContentText("Cep" + txtCep.getText());

        txtEndereco.setText("Enedereço digitado!");

        alert.showAndWait();
    }

    public void voltar(ActionEvent event) throws Exception{
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/controlati/controlatiadminconfig/menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }
}
