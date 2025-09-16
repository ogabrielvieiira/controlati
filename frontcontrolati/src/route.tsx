import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAdmin/index";
import Login from "./pages/login";
import Home from "./pages/home";
import LayoutLogin from "./components/LayoutLogin";
import Cadastro from "./pages/cadastrese";
import Usuario from "./pages/usuario";
import Equipamentos from "./pages/equipamentos";


function AppRoutes() {
    return(
        <Routes>
            <Route element={<LayoutLogin />}>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
            </Route>
            <Route element= {<LayoutAdmin/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/usuario" element={<Usuario/>}/>
                <Route path="/equipamentos" element={<Equipamentos/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;