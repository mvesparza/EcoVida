import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer({ isExpanded, setIsExpanded }) {
  return (
    <footer
      className={`footer ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* 📢 CTA visible antes del hover */}
      <div className="footer-preview">
        <p>📌 Contáctanos &nbsp; <span className="footer-arrow">▼</span></p>
      </div>

      {/* 🌱 Contenido Completo del Footer */}
      <div className="footer-container">
        {/* 📍 Información de contacto */}
        <div className="footer-section">
          <h4>🌿 EcoVida</h4>
          <p>Conectando a las personas con la naturaleza.</p>
          <p>📞 +593 999 999 999</p>
          <p>✉️ contacto@ecovida.org</p>
        </div>

        {/* 📌 Google Maps - Ubicación de EcoVida */}
        <div className="footer-section map-section">
          <h4>📍 Ubicación</h4>
          <iframe
            title="EcoVida Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.758091550921!2d-78.44509422519756!3d-0.3148209996820833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5bd12538eb13b%3A0x907c61f1abbe45ab!2sUniversidad%20de%20las%20Fuerzas%20Armadas%20ESPE!5e0!3m2!1ses!2sec!4v1741055972140!5m2!1ses!2sec"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* 📢 Redes Sociales */}
        <div className="footer-section">
          <h4>📣 Síguenos</h4>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* 🚀 Derechos reservados */}
      <div className="footer-bottom">
        <p>&copy; 2024 EcoVida. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
