import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileNavbar.css";

function ProfileNavbar({ user, onShowUsers }) {
  const navigate = useNavigate();
  
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="profile-navbar">
      <div className="nav-container">
        <h2 className="brand">🌿 EcoVida</h2>

        <ul className="nav-links">
          {user.rol === "administrador" && (
            <>
              <li>
                <button onClick={() => navigate("/perfil")}>Perfil</button> 
                <span 
                  className={`arrow ${isUsersMenuOpen ? 'open' : ''}`} 
                  onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)}
                >
                  ▶
                </span>
              </li>

              {isUsersMenuOpen && (
                <li className="submenu">
                  <button onClick={onShowUsers}>Usuarios</button>
                </li>
              )}

              <li>
                <button onClick={() => navigate("/gestion-productos")}>Gestión de Productos</button>
              </li>
            </>
          )}

          {user.rol === "cliente" && (
            <>
              <li><button onClick={() => navigate("/productos")}>Productos</button></li>
              <li><button onClick={() => navigate("/carrito")}>Carrito</button></li>
              <li><button onClick={() => navigate("/pedidos/historial")}>Tus Pedidos</button></li> {/* ✅ Nuevo botón */}
            </>
          )}
        </ul>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
    </nav>
  );
}

export default ProfileNavbar;
