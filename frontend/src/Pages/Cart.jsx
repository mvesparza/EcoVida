import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Obtener productos del carrito
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para ver el carrito.");
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3002/api/carrito", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCartItems(data);
    } catch (error) {
      console.error("Error al obtener el carrito:", error.message);
    }
  };

  // Obtener productos desde el catálogo
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/productos");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  // Actualizar cantidad de un producto en el carrito
  const updateCartQuantity = async (productoId, nuevaCantidad) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para modificar el carrito.");
        return;
      }

      const product = products.find((p) => p.id === productoId);
      if (!product) return;

      if (nuevaCantidad < 1) return;
      if (nuevaCantidad > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles.`);
        return;
      }

      const response = await fetch("http://localhost:3002/api/carrito", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId, cantidad: nuevaCantidad }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      // Actualizar estado local
      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.producto_id === productoId ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar cantidad:", error.message);
      alert("Error al modificar la cantidad.");
    }
  };

  // Eliminar un producto del carrito
  const removeFromCart = async (productoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para eliminar productos.");
        return;
      }

      const response = await fetch("http://localhost:3002/api/carrito", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setCartItems(prevCartItems => prevCartItems.filter(item => item.producto_id !== productoId));

      alert("Producto eliminado del carrito.");
    } catch (error) {
      console.error("Error al eliminar del carrito:", error.message);
      alert("Error al eliminar el producto.");
    }
  };

  // Realizar pedido (nuevo microservicio)
  const realizarPedido = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para realizar un pedido.");
        return;
      }

      const response = await fetch("http://localhost:3003/api/pedidos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Pedido realizado exitosamente.");
      setCartItems([]); // Vaciamos el carrito tras realizar pedido

      navigate("/pedidos/historial"); // Ir al historial de pedidos
    } catch (error) {
      console.error("Error al realizar el pedido:", error.message);
      alert("Error al realizar el pedido.");
    }
  };

  // Calcular total
  const totalPrice = cartItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.producto_id);
    return total + (product ? product.precio * item.cantidad : 0);
  }, 0);

  return (
    <div className="cart-page">
      <h2>🛒 Tu Carrito</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío.</p>
      ) : (
        <div>
          <div className="cart-items-container">
            {cartItems.map((item) => {
              const product = products.find(p => p.id === item.producto_id);
              if (!product) return null;

              return (
                <div key={item.producto_id} className="cart-card">
                  <img src={`/images/${product.imagen_url}`} alt={product.nombre} />
                  <div className="cart-info">
                    <h3>{product.nombre}</h3>
                    <p>{product.descripcion}</p>
                    <p><strong>Precio Unitario:</strong> ${product.precio}</p>
                    <p><strong>Stock Disponible:</strong> {product.stock}</p>
                    <div className="cart-quantity">
                      <button 
                        onClick={() => updateCartQuantity(item.producto_id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >➖</button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.producto_id, item.cantidad + 1)}
                        disabled={item.cantidad >= product.stock}
                      >➕</button>
                    </div>
                    <p><strong>Subtotal:</strong> ${(product.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.producto_id)}>🗑 Eliminar</button>
                </div>
              );
            })}
          </div>

          <h3 className="total-price">Total: ${totalPrice.toFixed(2)}</h3>

          <button className="pedido-btn" onClick={realizarPedido}>📦 Realizar Pedido</button>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>🔙 Volver Atrás</button>
    </div>
  );
}

export default Cart;
