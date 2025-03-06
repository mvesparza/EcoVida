import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./Pages/Profile";
import ProductManagement from "./Pages/ProductManagement";
import ProductListing from "./Pages/ProductListing";
import ProductPublic from "./Pages/ProductPublic";
import Cart from "./Pages/Cart"; 
import HistorialPedidos from "./Pages/HistorialPedidos"; // ✅ Importamos la nueva página de historial de pedidos

function App() {
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <Router>
      <div>
        <CustomCursor />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar
                  onContactClick={() => setIsFooterExpanded(true)}
                  onAboutClick={() => setIsAboutModalOpen(true)}
                  onLoginClick={() => setIsLoginOpen(true)}
                />
                <Hero />
                <Footer
                  isExpanded={isFooterExpanded}
                  setIsExpanded={setIsFooterExpanded}
                />
              </>
            }
          />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/gestion-productos" element={<ProductManagement />} />
          <Route path="/productos" element={<ProductListing />} />
          <Route path="/productos-publico" element={<ProductPublic />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/pedidos/historial" element={<HistorialPedidos />} /> {/* ✅ Nueva ruta */}
        </Routes>

        {isAboutModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAboutModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>🌿 Sobre Nosotros</h2>
              <p>
                EcoVida es una organización sin fines de lucro dedicada a la promoción de la
                agricultura orgánica y sostenible. Su misión es apoyar a pequeños agricultores,
                mejorar la salud pública y fomentar prácticas ambientales sostenibles.
              </p>
            </div>
          </div>
        )}

        {isLoginOpen && (
          <Login
            onClose={() => setIsLoginOpen(false)}
            onOpenRegister={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
          />
        )}

        {isRegisterOpen && <Register onClose={() => setIsRegisterOpen(false)} />}
      </div>
    </Router>
  );
}

export default App;
