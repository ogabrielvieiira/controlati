import { Link } from "react-router-dom";

function Sidebar(){
    
    return(
        <div className="d-flex">
        {/* Sidebar */}
        <div className="bg-dark text-light vh-100 p-3" style={{ width: '250px' }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link text-light">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-light"
                data-bs-toggle="collapse"
                href="#submenucadastro"
                role="button"
                aria-expanded="false"
                aria-controls="submenucadastro"
              >
                Cadastro
              </a>
              <ul className="collapse list-unstyled ms-3" id="submenucadastro">
                <li>
                  <Link to="/usuario" className="nav-link text-white">Usuário</Link>
                </li>
                <li>
                  <Link to="/equipamentos" className="nav-link text-white">Equipamentos</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-light"
                data-bs-toggle="collapse"
                href="#submenugestao"
                role="button"
                aria-expanded="false"
                aria-controls="submenugestao"
              >
                Administrativo
              </a>
              <ul className="collapse list-unstyled ms-3" id="submenugestao">
                <li>
                  <Link to="/usuarios-lista" className="nav-link text-white">
                    Lista de Usuários
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
}

export default Sidebar;