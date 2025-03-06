import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HistorialPedidos.css";

function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false); // <- Estado para forzar recarga
  const navigate = useNavigate();

  useEffect(() => {
    fetchPedidos();
  }, [reloadFlag]); // <- Escucha cambios en reloadFlag

  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3003/api/pedidos/historial", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message);

      setPedidos(data.pedidos);
    } catch (error) {
      console.error("Error al cargar historial de pedidos:", error.message);
      alert("Error al cargar el historial.");
    }
  };

  const confirmarPedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3003/api/pedidos/confirm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pedidoId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message);

      alert("Pedido confirmado correctamente.");
      setReloadFlag((prev) => !prev); // 🔄 Forzar recarga
    } catch (error) {
      console.error("Error al confirmar pedido:", error.message);
      alert("Error al confirmar el pedido.");
    }
  };

  const cancelarPedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3003/api/pedidos/cancel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pedidoId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message);

      alert("Pedido cancelado correctamente.");
      setReloadFlag((prev) => !prev); // 🔄 Forzar recarga
    } catch (error) {
      console.error("Error al cancelar pedido:", error.message);
      alert("Error al cancelar el pedido.");
    }
  };

  return (
    <div className="historial-page">
      <h2>📦 Historial de Pedidos</h2>
      <button className="back-btnHP" onClick={() => navigate("/perfil")}>
        👤 Volver al Perfil
      </button>

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <ul className="pedidos-list">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="pedido-item">
              <p><strong>ID:</strong> {pedido.id}</p>
              <p><strong>Estado:</strong> {pedido.estado}</p>
              <p><strong>Fecha:</strong> {new Date(pedido.fecha_creacion).toLocaleString()}</p>
              <p><strong>Total:</strong> ${pedido.total}</p>

              {pedido.estado === "pendiente" && (
                <div className="pedido-actions">
                  <button 
                    className="confirm-btn"
                    onClick={() => confirmarPedido(pedido.id)}
                  >
                    ✅ Confirmar
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={() => cancelarPedido(pedido.id)}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistorialPedidos;
