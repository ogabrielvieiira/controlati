

function Sidebar(){
    
    return(
        <div className="d-flex">
        {/* Sidebar */}
        <div className="bg-dark text-light vh-100 p-3" style={{ width: '250px' }}>
          <div className="mb-4 text-center">
          <img
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSJibHVlIi8+PC9zdmc+"
        alt="logo"
        className="img-fluid"
        style={{ height: '50px' }}
      />
          </div>
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
                  <a className="nav-link text-light" href="/usuario">Usuário</a>
                </li>
                <li>
                  <a className="nav-link text-light" href="/equipamentos">Equipamentos</a>
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