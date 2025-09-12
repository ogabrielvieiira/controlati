import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAdmin/index";
import Login from "./pages/login";
import Home from "./pages/home";
import LayoutLogin from "./components/LayoutLogin";
import Cadastro from "./pages/cadastrese";


function AppRoutes() {
    return(
        <Routes>
            <Route element={<LayoutLogin />}>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
            </Route>
            <Route element= {<LayoutAdmin/>}>
                <Route path="/" element={<Home/>}/>
            </Route>
        </Routes>
    );
}

export default AppRoutes;