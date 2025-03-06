import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import DOMPurify from "dompurify"; // Seguridad extra para sanitizar inputs
import "./Auth.css";

function Register({ onClose }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const sanitizeInput = (input) => DOMPurify.sanitize(input.trim());

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let isValid = true;

    // Limpiar errores previos
    setNombreError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");

    // Sanitizar todos los campos
    const sanitizedNombre = sanitizeInput(form.nombre);
    const sanitizedEmail = sanitizeInput(form.email);
    const sanitizedPassword = sanitizeInput(form.password);
    const sanitizedConfirmPassword = sanitizeInput(form.confirmPassword);

    // Validación nombre
    if (!sanitizedNombre) {
      setNombreError("El nombre es obligatorio");
      isValid = false;
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      setEmailError("El correo es obligatorio");
      isValid = false;
    } else if (!emailRegex.test(sanitizedEmail)) {
      setEmailError("El correo no es válido");
      isValid = false;
    }

    // Validación contraseña fuerte
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!sanitizedPassword) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else if (!passwordRegex.test(sanitizedPassword)) {
      setPasswordError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial"
      );
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      isValid = false;
    }

    // Si alguna validación falló, detenemos el flujo
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Sanitizar los datos antes de enviarlos (extra capa de protección)
    const sanitizedData = {
      nombre: sanitizeInput(form.nombre),
      email: sanitizeInput(form.email),
      password: sanitizeInput(form.password),
    };

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal fade-in">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Registro</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            onChange={handleChange}
          />
          {nombreError && <p className="input-error">{nombreError}</p>}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
          />
          {emailError && <p className="input-error">{emailError}</p>}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
          {passwordError && <p className="input-error">{passwordError}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
          />
          {confirmPasswordError && (
            <p className="input-error">{confirmPasswordError}</p>
          )}

          <button type="submit" className="auth-btn">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
