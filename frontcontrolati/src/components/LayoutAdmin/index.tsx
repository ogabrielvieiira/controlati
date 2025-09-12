
import { Outlet } from "react-router-dom";
import Header from "../header";
import Sidebar from "../sidebar";
import Footer from "../footer";



function LayoutAdmin(){
    return(
        <>
            <Header/>
            <div className="d-flex">
                <Sidebar/>
                <div className="flex-grow-1 p-4">
                    <Outlet/>
                </div>
            </div>
            
            <Footer/>
        </>
    );
}

export default LayoutAdmin;