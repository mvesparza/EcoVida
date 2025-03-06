import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import ProfileNavbar from "../components/ProfileNavbar/ProfileNavbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", email: "", password: "", rol: "cliente" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 📌 Verifica si hay un token antes de cargar la página
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/usuarios/perfil", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setUser(data);
      } catch (error) {
        console.error("Error al cargar perfil:", error.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  // 📌 Obtiene la lista de usuarios (Solo para administradores)
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/usuarios", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    }
  };

  // 📌 Eliminar usuario
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("No se pudo eliminar el usuario");
      alert("Usuario eliminado correctamente");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
    }
  };

  // 📌 Crear un nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Usuario creado exitosamente.");
      setUsers([...users, data.user]);
      setNewUser({ nombre: "", email: "", password: "", rol: "cliente" });
      setShowCreateUserForm(false); // Ocultar el formulario después de crear un usuario
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) return <div className="profile-container"><p>Cargando perfil...</p></div>;

  return (
    <div className="profile-page">
      <ProfileNavbar user={user} onShowUsers={() => { setShowUsers(!showUsers); fetchUsers(); }} />

      <div className="profile-container fade-in">
        <div className="profile-card">
          <h2>👤 Mi Perfil</h2>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
          
        </div>

        {/* 📌 Gestión de usuarios (Solo Administradores) */}
        {user.rol === "administrador" && showUsers && (
          <div className="user-management">
            <div className="user-header">
              <h3>📋 Lista de Usuarios</h3>
              <button className="new-user-btn" onClick={() => setShowCreateUserForm(!showCreateUserForm)}>
                {showCreateUserForm ? "Cancelar" : "Nuevo Usuario"}
              </button>
            </div>

            {showCreateUserForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setError("");

                  // Validaciones directamente en esta función
                  let valid = true;
                  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,}$/;
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

                  if (!newUser.nombre.trim() || !nombreRegex.test(newUser.nombre)) {
                    setError("⚠️ Nombre inválido. Debe tener al menos 3 letras y solo puede contener letras y espacios.");
                    valid = false;
                  } else if (!newUser.email.trim() || !emailRegex.test(newUser.email)) {
                    setError("⚠️ Correo electrónico inválido.");
                    valid = false;
                  } else if (!newUser.password.trim() || !passwordRegex.test(newUser.password)) {
                    setError(
                      "⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
                    );
                    valid = false;
                  } else if (!newUser.rol || (newUser.rol !== "cliente" && newUser.rol !== "administrador")) {
                    setError("⚠️ Debes seleccionar un rol válido.");
                    valid = false;
                  }

                  if (valid) {
                    handleCreateUser(e); // Llamamos a la función real si todo está correcto
                  }
                }}
                className="create-user-form fade-in"
              >
                <h3>➕ Crear Nuevo Usuario</h3>
                {error && <p className="auth-error">{error}</p>}
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                  onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  required
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  required
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                  name="rol"
                  required
                  onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                </select>
                <button type="submit" className="create-user-btn">
                  Crear Usuario
                </button>
              </form>
            )}

            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;
