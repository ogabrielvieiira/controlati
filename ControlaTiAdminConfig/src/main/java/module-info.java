module com.controlati.controlatiadminconfig {
    requires javafx.controls;
    requires javafx.fxml;


    requires jakarta.persistence;
    requires org.hibernate.orm.core;


    opens com.controlati.controlatiadminconfig to javafx.fxml;
    opens com.controlati.controlatiadminconfig.model to org.hibernate.orm.core;



    exports com.controlati.controlatiadminconfig;
    exports com.controlati.controlatiadminconfig.controller;
    opens com.controlati.controlatiadminconfig.controller to javafx.fxml;
}