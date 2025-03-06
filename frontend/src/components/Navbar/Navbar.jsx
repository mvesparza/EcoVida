import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../../assets/logo.png';

function Navbar({ onContactClick, onAboutClick, onLoginClick }) {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img src={logo} alt="EcoVida Logo" height="50" className="logo-animate" />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link animated-link" href="#" onClick={(e) => {
                e.preventDefault();
                onAboutClick();
              }}>Sobre Nosotros</a>
            </li>
            <li className="nav-item">
              <a className="nav-link animated-link" href="#" onClick={(e) => {
                e.preventDefault();
                onContactClick();
              }}>Contacto</a>
            </li>
            <li className="nav-item">
              <a className="nav-link animated-link" href="#" onClick={(e) => {
                e.preventDefault();
                onLoginClick();
              }}>Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
