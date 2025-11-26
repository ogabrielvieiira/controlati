import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAdmin/index";
import Login from "./pages/login";
import Home from "./pages/home";
import LayoutLogin from "./components/LayoutLogin";
import Usuario from "./pages/usuario";
import Equipamentos from "./pages/equipamentos";
import ListaUsuarios from "./pages/lista-usuarios";
import RecuperarSenha from "./pages/recuperar-senha";
import RedefinirSenha from "./pages/redefinir-senha";

function AppRoutes() {
    return(
        <Routes>
            <Route element={<LayoutLogin />}>
                <Route path="/login" element={<Login />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/redefinir-senha" element={<RedefinirSenha />} />
            </Route>
            <Route element= {<LayoutAdmin/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/usuario" element={<Usuario/>}/>
                <Route path="/equipamentos" element={<Equipamentos/>}/>
                <Route path="/usuarios-lista" element={<ListaUsuarios/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;