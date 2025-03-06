import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductListing.css"; // Archivo de estilos

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]); // 📌 Lista de productos en el carrito
  const [activeTab, setActiveTab] = useState("productos"); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const navigate = useNavigate();

  // 📌 Obtener productos y categorías desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("http://localhost:3001/api/productos");
        const categoriesRes = await fetch("http://localhost:3001/api/categorias");
        const cartRes = await fetch("http://localhost:3002/api/carrito", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const cartData = cartRes.ok ? await cartRes.json() : [];

        if (!productsRes.ok) throw new Error(productsData.error);
        if (!categoriesRes.ok) throw new Error(categoriesData.error);

        setProducts(productsData);
        setCategories(categoriesData);
        setCartItems(cartData);
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      }
    };

    fetchData();
  }, []);

  // 📌 Verifica si el producto ya está en el carrito
  const isProductInCart = (productoId) => {
    return cartItems.some(item => item.producto_id === productoId);
  };

  // 📌 Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoria_id === selectedCategory)
    : [];

  // 📌 Agregar producto al carrito
  const addToCart = async (productoId, stockDisponible) => {
    if (stockDisponible < 1) {
      alert("Este producto está agotado.");
      return;
    }

    if (isProductInCart(productoId)) {
      alert("Este producto ya está en el carrito.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para agregar productos al carrito.");
        return;
      }

      const response = await fetch("http://localhost:3002/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId, cantidad: 1 }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Producto agregado al carrito!");

      // 📌 Actualizar la lista de productos en el carrito
      setCartItems([...cartItems, { producto_id: productoId, cantidad: 1 }]);

    } catch (error) {
      console.error("Error al agregar al carrito:", error.message);
      alert("Error al agregar el producto al carrito.");
    }
  };

  // 📌 Función para obtener la ruta local de la imagen
  const getLocalImageUrl = (fileName) => {
    return fileName ? `/images/${fileName}` : "default-image.jpg";
  };

  return (
    <div className="product-listing-page">
      
      {/* 📌 Menú lateral */}
      <aside className="sidebar">
        <button className="profile-btn" onClick={() => navigate("/perfil")}>👤 Volver al Perfil</button>

        <div className="menu-items">
          <button className={activeTab === "productos" ? "active" : ""} 
            onClick={() => { setActiveTab("productos"); setSelectedCategory(null); }}>
            📦 Productos
          </button>
          <button className={activeTab === "categorias" ? "active" : ""} 
            onClick={() => { setActiveTab("categorias"); setSelectedCategory(null); }}>
            📂 Categorías
          </button>

          {/* 📂 Submenú de categorías */}
          {activeTab === "categorias" && (
            <ul className="category-submenu">
              {categories.map((cat) => (
                <li key={cat.id} onClick={() => setSelectedCategory(cat.id)} 
                    className={selectedCategory === cat.id ? "active" : ""}>
                  {cat.nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 📌 Botón para ir al carrito */}
        <button className="cart-btn" onClick={() => navigate("/carrito")}>🛒 Ir al Carrito</button>
      </aside>

      {/* 📌 Contenido principal */}
      <div className="content">
        {activeTab === "productos" && <h2>🛍 Productos Disponibles</h2>}
        {activeTab === "categorias" && <h2>📂 Selecciona una Categoría</h2>}

        {/* 📦 Productos */}
        {activeTab === "productos" || (activeTab === "categorias" && selectedCategory) ? (
          <div className="product-cards-container">
            {filteredProducts.length > 0 || activeTab === "productos" ? (
              (activeTab === "productos" ? products : filteredProducts).map((p) => {
                const alreadyInCart = isProductInCart(p.id);
                return (
                  <div key={p.id} className="product-card">
                    <img src={getLocalImageUrl(p.imagen_url)} alt={p.nombre} />

                    <div className="product-info">
                      <h3>{p.nombre}</h3>
                      <p>{p.descripcion}</p>
                    </div>
                    <div className="product-details">
                      <p><strong>Precio:</strong> ${p.precio}</p>
                      <p><strong>Categoría:</strong> {categories.find(cat => cat.id === p.categoria_id)?.nombre || "Sin Categoría"}</p>
                      <p><strong>Stock Disponible:</strong> {p.stock}</p>
                    </div>
                    <button 
                      className="add-to-cart-btn" 
                      onClick={() => addToCart(p.id, p.stock)}
                      disabled={p.stock < 1 || alreadyInCart} // ❌ Bloquea si está agotado o ya en el carrito
                    >
                      {p.stock > 0 ? (alreadyInCart ? "✅ Agregado" : "🛒 Agregar") : "⛔ Agotado"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="no-products">No hay productos en esta categoría.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductListing;
