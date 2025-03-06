import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'; // Usamos esta librería para sanitizar inputs
import "./Auth.css";

function Login({ onClose, onOpenRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim()); // Elimina scripts, HTML raro, etc.
  };

  const validateForm = () => {
    let isValid = true;

    // Resetear mensajes de error
    setEmailError("");
    setPasswordError("");

    // Sanitizar inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      setEmailError("El correo es obligatorio");
      isValid = false;
    } else if (!emailRegex.test(sanitizedEmail)) {
      setEmailError("El correo no es válido");
      isValid = false;
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (!sanitizedPassword) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else if (sanitizedPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    // Preparamos datos sanitizados para el envío
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sanitizedEmail, password: sanitizedPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.rol);

      alert("Inicio de sesión exitoso");
      onClose();
      navigate("/perfil");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal fade-in">
        <button className="close-btn" onClick={onClose}><FaTimes /></button>
        <h2>Iniciar Sesión</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="input-error">{emailError}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="input-error">{passwordError}</p>}

          <button type="submit" className="auth-btn">Ingresar</button>
        </form>
        <p className="auth-switch">
          ¿No tienes cuenta? <span onClick={onOpenRegister}>Regístrate</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
