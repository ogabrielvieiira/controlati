import { Link } from "react-router-dom";



function Header(){
    return(
        <header className="bg-dark">
            <nav className="navbar navbar-expand-lg navbar-dark px-3">
                <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">Home</Link>
                <Link to="/usuarios" className="nav-item nav-link">Usuários</Link>
                </div>
            </nav>
        </header>

      
    );
}

export default Header;