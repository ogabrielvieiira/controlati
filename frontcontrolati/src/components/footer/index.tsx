

function Footer(){
    return(
        <footer className="bg-dark text-light text-center py-4">
            <p className="mb-0">
                &copy; {new Date().getFullYear()} Gabriel Vieira. Todos os direitos reservados.
            </p>
        </footer>);
}

export default Footer;