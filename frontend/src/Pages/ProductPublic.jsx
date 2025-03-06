import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductPublic.css"; // Archivo de estilos

function ProductPublic() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("productos");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("http://localhost:3001/api/productos");
        const categoriesRes = await fetch("http://localhost:3001/api/categorias");

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (!productsRes.ok) throw new Error(productsData.error);
        if (!categoriesRes.ok) throw new Error(categoriesData.error);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al cargar productos:", error.message);
      }
    };

    fetchData();
  }, []);

  // 📌 Función para obtener la ruta local de la imagen
  const getLocalImageUrl = (fileName) => {
    return fileName ? `/images/${fileName}` : "default-image.jpg";
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoria_id === selectedCategory)
    : [];

  return (
    <div className="product-listing-page">
      <aside className="sidebar">
        <button className="home-btn" onClick={() => navigate("/")}>🏠 Ir a Inicio</button>
        <button className={activeTab === "productos" ? "active" : ""} onClick={() => { setActiveTab("productos"); setSelectedCategory(null); }}>
          📦 Productos
        </button>
        <button className={activeTab === "categorias" ? "active" : ""} onClick={() => { setActiveTab("categorias"); setSelectedCategory(null); }}>
          📂 Categorías
        </button>

        {activeTab === "categorias" && (
          <ul className="category-submenu">
            {categories.map((cat) => (
              <li key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={selectedCategory === cat.id ? "active" : ""}>
                {cat.nombre}
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div className="content">
        {activeTab === "productos" && <h2>🛍 Productos Disponibles al Público</h2>}
        {activeTab === "categorias" && <h2>📂 Selecciona una Categoría</h2>}

        {activeTab === "productos" || (activeTab === "categorias" && selectedCategory) ? (
          <div className="product-cards-container">
            {filteredProducts.length > 0 || activeTab === "productos" ? (
              (activeTab === "productos" ? products : filteredProducts).map((p) => (
                <div key={p.id} className="product-card">
                  {/* 📌 Corregido: Usamos getLocalImageUrl para mostrar imágenes locales */}
                  <img src={getLocalImageUrl(p.imagen_url)} alt={p.nombre} />
                  <div className="product-info">
                    <h3>{p.nombre}</h3>
                    <p>{p.descripcion}</p>
                  </div>
                  <div className="product-details">
                    <p><strong>Precio:</strong> ${p.precio}</p>
                    <p><strong>Categoría:</strong> {categories.find(cat => cat.id === p.categoria_id)?.nombre || "Sin Categoría"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products">No hay productos en esta categoría.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProductPublic;
