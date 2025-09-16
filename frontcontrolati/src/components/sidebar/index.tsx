import { Link } from "react-router-dom";


function Sidebar(){
    
    return(
        <div className="d-flex">
        {/* Sidebar */}
        <div className="bg-dark text-light vh-100 p-3" style={{ width: '250px' }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link text-light" href="/">Home</a>
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
          </ul>
        </div>
      
        {/* Conteúdo principal */}
        <div className="flex-grow-1 p-3">
          {/* Aqui vai o resto do conteúdo */}
        </div>
      </div>
      
    )
}

export default Sidebar;