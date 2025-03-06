import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductManagement.css";
import ProfileNavbar from "../components/ProfileNavbar/ProfileNavbar";

function ProductManagement() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateProductForm, setShowCreateProductForm] = useState(false);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
  const [activeTab, setActiveTab] = useState("productos");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);


  // 📌 Datos correctos del producto según el backend
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen_url: "",
    categoria_id: ""
  });

  // 📌 Datos correctos de la categoría
  const [newCategory, setNewCategory] = useState({
    nombre: "",
    descripcion: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 📌 Obtener token de localStorage
  const getToken = () => localStorage.getItem("token");

  // 📌 Cargar productos y categorías desde la API
  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const [profileRes, productsRes, categoriesRes] = await Promise.all([
        fetch("http://localhost:3000/api/usuarios/perfil", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:3001/api/productos"),
        fetch("http://localhost:3001/api/categorias"),
      ]);

      const [profileData, productsData, categoriesData] = await Promise.all([
        profileRes.json(),
        productsRes.json(),
        categoriesRes.json(),
      ]);

      if (!profileRes.ok) throw new Error(profileData.error);
      if (!productsRes.ok) throw new Error(productsData.error);
      if (!categoriesRes.ok) throw new Error(categoriesData.error);

      if (profileData.rol !== "administrador") {
        alert("Acceso denegado. Solo los administradores pueden gestionar productos.");
        navigate("/");
        return;
      }

      setUser(profileData);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error al cargar datos:", error.message);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // 📌 Crear Producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3001/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Producto creado exitosamente.");
      setProducts([...products, data]); // 📌 Actualiza la lista
      setShowCreateProductForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // 📌 Crear Categoría
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const token = getToken();

    try {
      const response = await fetch("http://localhost:3001/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("Categoría creada exitosamente.");
      setCategories([...categories, data]); // 📌 Actualiza la lista
      setShowCreateCategoryForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateProduct = async (product) => {
    const token = getToken();
    try {
      const response = await fetch(`http://localhost:3001/api/productos/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Error al actualizar producto");
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)));
      setEditingProduct(null);
      alert("Producto actualizado correctamente.");
    } catch (error) {
      console.error(error.message);
    }
};


const handleDeleteProduct = async (id) => {
    const token = getToken();
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar producto");
      setProducts(products.filter((p) => p.id !== id));
      alert("Producto eliminado correctamente.");
    } catch (error) {
      console.error(error.message);
    }
};

const handleUpdateCategory = async (category) => {
    const token = getToken();
    try {
      const response = await fetch(`http://localhost:3001/api/categorias/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error("Error al actualizar categoría");
      const updatedCategory = await response.json();
      setCategories(categories.map((c) => (c.id === category.id ? updatedCategory : c)));
      setEditingCategory(null);
      alert("Categoría actualizada correctamente.");
    } catch (error) {
      console.error(error.message);
    }
};

const handleDeleteCategory = async (id) => {
    const token = getToken();
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/categorias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar categoría");
      setCategories(categories.filter((c) => c.id !== id));
      alert("Categoría eliminada correctamente.");
    } catch (error) {
      console.error(error.message);
    }
};

const getLocalImageUrl = (fileName) => {
  return fileName ? `/images/${fileName}` : "default-image.jpg";
};

  if (!user) return <div className="loading">Cargando...</div>;

  return (
    <div className="product-page">
      <ProfileNavbar user={user} />
  
      <div className="product-container">
        <div className="tab-header">
          <button className={activeTab === "productos" ? "active" : ""} onClick={() => setActiveTab("productos")}>Productos</button>
          <button className={activeTab === "categorias" ? "active" : ""} onClick={() => setActiveTab("categorias")}>Categorías</button>
        </div>
  
        {/* 📦 Gestión de Productos */}
        {activeTab === "productos" && (
          <>
            <div className="header">
              <h2>📦 Gestión de Productos</h2>
              <button className="new-btnP" onClick={() => setShowCreateProductForm(!showCreateProductForm)}>
                {showCreateProductForm ? "Cancelar" : "Nuevo Producto"}
              </button>
            </div>
  
            {showCreateProductForm && (
            <form onSubmit={handleCreateProduct} className="product-form">
                <h3>➕ Agregar Producto</h3>
                
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={newProduct.nombre}
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Sanitizar: Eliminar scripts o etiquetas HTML (protección básica contra XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Limitar caracteres extraños (solo letras, espacios y acentos, según el caso)
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;
                    if (!regexPermitidos.test(value)) {
                      return; // Si mete caracteres no válidos, no actualizamos el estado.
                    }

                    // 3️⃣ Opcional: Trimear (quitar espacios al inicio y fin)
                    value = value.trimStart();  // Solo quitamos el espacio inicial, no los intermedios.

                    // 4️⃣ Validación mínima de longitud
                    if (value.length > 0 && value.length < 3) {
                      setError("⚠️ El nombre debe tener al menos 3 caracteres.");
                    } else {
                      setError("");  // Limpia error si el valor es válido
                    }

                    // 5️⃣ Guardar en el estado solo si es válido
                    setNewProduct({ ...newProduct, nombre: value });
                  }}
                />

                <input
                  type="text"
                  placeholder="Descripción"
                  required
                  value={newProduct.descripcion}
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Sanitización: eliminar cualquier etiqueta HTML
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir letras, números, espacios y algunos signos básicos
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\-() ]*$/;
                    if (!regexPermitidos.test(value)) {
                      return; // Si mete caracteres raros, no actualizamos el estado.
                    }

                    // 3️⃣ Limpiar espacios al inicio
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima
                    if (value.length > 0 && value.length < 10) {
                      setError("⚠️ La descripción debe tener al menos 10 caracteres.");
                    } else {
                      setError(""); // Limpia error si ya es válida.
                    }

                    // 5️⃣ Guardamos solo si es válido
                    setNewProduct({ ...newProduct, descripcion: value });
                  }}
                />

                
                {/* Para el precio: usamos el tipo number, y aseguramos que el valor sea siempre un número flotante */}
                <input
                  type="number"
                  max={20}
                  min={0.10}
                  placeholder="Precio"
                  required
                  step="any"
                  value={newProduct.precio}
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Convertir a número flotante
                    let precio = parseFloat(value);

                    // 2️⃣ Validación básica: ¿es un número?
                    if (isNaN(precio)) {
                      setError("⚠️ El precio debe ser un número válido.");
                      return;
                    }

                    // 3️⃣ Bloquear negativos y valores menores que 0.10
                    if (precio < 0.10) {
                      setError("⚠️ El precio no puede ser menor a 0.10.");
                      return;
                    }

                    // 4️⃣ Máximo permitido (ejemplo: 20)
                    if (precio > 20) {
                      setError("⚠️ El precio no puede ser mayor a 20.");
                      return;
                    }

                    // 5️⃣ Limpiar error si todo está ok
                    setError("");

                    // 6️⃣ Guardar el precio limpio en el estado
                    setNewProduct({ ...newProduct, precio: precio });
                  }}
                />

                
                {/* Para el stock */}
                <input
                  type="number"
                  max={20}
                  min={1}
                  placeholder="Stock"
                  required
                  value={newProduct.stock}
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Convertir a entero
                    let stock = parseInt(value);

                    // 2️⃣ Validación: ¿es un número entero válido?
                    if (isNaN(stock)) {
                      setError("⚠️ El stock debe ser un número válido.");
                      return;
                    }

                    // 3️⃣ Bloqueo de valores negativos o inválidos
                    if (stock < 1) {
                      setError("⚠️ El stock mínimo permitido es 1.");
                      return;
                    }

                    // 4️⃣ Máximo permitido
                    if (stock > 20) {
                      setError("⚠️ El stock máximo permitido es 20.");
                      return;
                    }

                    // 5️⃣ Limpiar error si todo es correcto
                    setError("");

                    // 6️⃣ Guardar el valor válido en el estado
                    setNewProduct({ ...newProduct, stock: stock });
                  }}
                />

                
                <input
                  type="text"
                  placeholder="Nombre del archivo de imagen"
                  required
                  value={newProduct.imagen_url.replace(".jpg", "")}
                  onChange={(e) => {
                    let fileName = e.target.value.trim();

                    // 1️⃣ Sanitizar: solo permitimos letras, números, guiones y guiones bajos
                    const regexPermitidos = /^[a-zA-Z0-9_-]*$/;

                    if (!regexPermitidos.test(fileName)) {
                      setError("⚠️ El nombre de archivo solo puede contener letras, números, guiones y guiones bajos.");
                      return;
                    }

                    // 2️⃣ No permitir que metan rutas o secuencias peligrosas (como ../ o /etc/)
                    if (fileName.includes("/") || fileName.includes("..")) {
                      setError("⚠️ El nombre de archivo no puede contener rutas o directorios.");
                      return;
                    }

                    // 3️⃣ Forzar extensión .jpg y limpiar error si es válido
                    fileName += ".jpg";
                    setError("");

                    // 4️⃣ Actualizar estado con el nombre limpio
                    setNewProduct({ ...newProduct, imagen_url: fileName });
                  }}
                />

                <select
                required
                onChange={(e) => setNewProduct({ ...newProduct, categoria_id: e.target.value })}
                >
                <option value="">Seleccione Categoría</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
                </select>

                <button type="submit">Crear Producto</button>
            </form>
            )}

  
           {/* 📌 Contenedor de tarjetas de productos */}
            <div className="product-cards-container">
                {products.map((p) => (
                    <div key={p.id} className="product-card">
                        <img 
                          src={getLocalImageUrl(p.imagen_url)} 
                          alt={p.nombre} 
                          className="product-image"
                        />

                        <div className="product-info">
                            <h3>{p.nombre}</h3>
                            <p>{p.descripcion}</p>
                        </div>
                        <div className="product-details">
                            <p>Precio: ${p.precio}</p>
                            <p>Stock: {p.stock}</p>
                            <p>Categoría: {categories.find(cat => cat.id === p.categoria_id)?.nombre || "Sin Categoría"}</p>
                        </div>
                        <div className="actions">
                            <button onClick={() => setEditingProduct(p)}>✏ Editar</button>
                            <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>🗑 Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

  
            {/* 📌 Formulario para editar producto */}
            {editingProduct && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProduct(editingProduct);
                }}
                className="edit-product-form"
              >
                <h3>✏ Editar Producto</h3>
                
                <input
                  type="text"
                  value={editingProduct.nombre}
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir solo letras, espacios y acentos
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;
                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ El nombre solo puede contener letras y espacios.");
                      return;
                    }

                    // 3️⃣ Eliminar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima (al menos 3 caracteres)
                    if (value.length > 0 && value.length < 3) {
                      setError("⚠️ El nombre debe tener al menos 3 caracteres.");
                    } else {
                      setError(""); // Limpia el error si es válido
                    }

                    // 5️⃣ Guardar nombre validado
                    setEditingProduct({ ...editingProduct, nombre: value });
                  }}
                />

                
                <input
                  type="text"
                  value={editingProduct.descripcion}
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (protección XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir solo letras, números, espacios y algunos símbolos básicos
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\-() ]*$/;
                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ La descripción solo puede contener letras, números y los caracteres ., - ( ).");
                      return;
                    }

                    // 3️⃣ Eliminar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima (por ejemplo, mínimo 10 caracteres)
                    if (value.length > 0 && value.length < 10) {
                      setError("⚠️ La descripción debe tener al menos 10 caracteres.");
                    } else {
                      setError(""); // Limpiar error si es válido
                    }

                    // 5️⃣ Guardar descripción validada
                    setEditingProduct({ ...editingProduct, descripcion: value });
                  }}
                />

                
                <input
                  type="number"
                  value={editingProduct.precio}
                  required
                  step="any"
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Convertir a número flotante
                    let precio = parseFloat(value);

                    // 2️⃣ Validar si es un número real (no letras, etc.)
                    if (isNaN(precio)) {
                      setError("⚠️ El precio debe ser un número válido.");
                      return;
                    }

                    // 3️⃣ Validar que no sea negativo o cero
                    if (precio <= 0) {
                      setError("⚠️ El precio debe ser mayor a 0.");
                      return;
                    }

                    // 4️⃣ Opcional: definir un máximo
                    if (precio > 1000) {
                      setError("⚠️ El precio no puede ser mayor a 1000.");
                      return;
                    }

                    // 5️⃣ Limpiar error si es válido
                    setError("");

                    // 6️⃣ Guardar precio validado
                    setEditingProduct({
                      ...editingProduct,
                      precio: precio,
                    });
                  }}
                />

                
                <input
                  type="number"
                  value={editingProduct.stock}
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Convertir a entero
                    let stock = parseInt(value);

                    // 2️⃣ Validar que sea un número real (no letras o caracteres raros)
                    if (isNaN(stock)) {
                      setError("⚠️ El stock debe ser un número válido.");
                      return;
                    }

                    // 3️⃣ Validar que sea positivo (mínimo 1)
                    if (stock < 1) {
                      setError("⚠️ El stock mínimo permitido es 1.");
                      return;
                    }

                    // 4️⃣ Definir un máximo (opcional)
                    if (stock > 1000) {
                      setError("⚠️ El stock no puede ser mayor a 1000.");
                      return;
                    }

                    // 5️⃣ Limpiar error si es válido
                    setError("");

                    // 6️⃣ Guardar stock validado
                    setEditingProduct({
                      ...editingProduct,
                      stock: stock,
                    });
                  }}
                />

                
                {/* Nueva entrada para la URL de la imagen */}
                <input
                    type="text"
                    value={editingProduct.imagen_url || ""}
                    placeholder="URL de Imagen"
                    required
                    onChange={(e) => {
                      let value = e.target.value.trim();

                      // 1️⃣ Eliminar etiquetas HTML o scripts (protección básica contra XSS)
                      value = value.replace(/<[^>]*>?/g, "");

                      // 2️⃣ No permitir rutas sospechosas o subidas de carpetas
                      if (value.includes("..") || value.includes("/")) {
                        setError("⚠️ El nombre de archivo o URL no puede contener rutas o directorios.");
                        return;
                      }

                      // 3️⃣ Forzar extensión ".jpg"
                      if (!value.endsWith(".jpg")) {
                        value += ".jpg";
                      }

                      // 4️⃣ Validar formato final (solo letras, números, guiones y guiones bajos en el nombre)
                      const nombreArchivo = value.replace(".jpg", ""); // Quitamos el .jpg para validar nombre
                      const regexPermitidos = /^[a-zA-Z0-9_-]+$/;

                      if (!regexPermitidos.test(nombreArchivo)) {
                        setError("⚠️ El nombre de archivo solo puede contener letras, números, guiones y guiones bajos.");
                        return;
                      }

                      // 5️⃣ Limpiar error si es válido
                      setError("");

                      // 6️⃣ Guardar URL validada
                      setEditingProduct({ ...editingProduct, imagen_url: value });
                    }}
                  />


                <button type="submit">Actualizar Producto</button>
                <button type="button" onClick={() => setEditingProduct(null)}>Cancelar</button>
              </form>
            )}

          </>
        )}
  
        {/* 📂 Gestión de Categorías */}
        {activeTab === "categorias" && (
          <>
            <h2>📂 Gestión de Categorías</h2>
            <button className="new-btn" onClick={() => setShowCreateCategoryForm(!showCreateCategoryForm)}>
              {showCreateCategoryForm ? "Cancelar" : "Nueva Categoría"}
            </button>
  
            {showCreateCategoryForm && (
              <form onSubmit={handleCreateCategory} className="category-form">
                <h3>➕ Agregar Categoría</h3>
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (protección contra XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir solo letras, espacios y acentos
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;

                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ El nombre solo puede contener letras, espacios y acentos.");
                      return; // No actualiza el estado si es inválido
                    }

                    // 3️⃣ Quitar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima (al menos 3 caracteres)
                    if (value.length > 0 && value.length < 3) {
                      setError("⚠️ El nombre debe tener al menos 3 caracteres.");
                    } else {
                      setError(""); // Limpia error si ya es válido
                    }

                    // 5️⃣ Actualizar estado solo si es válido
                    setNewCategory({ ...newCategory, nombre: value });
                  }}
                />

                <input
                  type="text"
                  placeholder="Descripción"
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (protección contra XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir solo letras, números, espacios y algunos símbolos básicos
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\-() ]*$/;

                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ La descripción solo puede contener letras, números, espacios y caracteres ., - ()");
                      return; // No actualiza el estado si es inválido
                    }

                    // 3️⃣ Quitar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima (al menos 10 caracteres)
                    if (value.length > 0 && value.length < 10) {
                      setError("⚠️ La descripción debe tener al menos 10 caracteres.");
                    } else {
                      setError(""); // Limpia error si ya es válida
                    }

                    // 5️⃣ Actualizar estado solo si es válido
                    setNewCategory({ ...newCategory, descripcion: value });
                  }}
                />

                <button type="submit" className="create-category-btn">Crear Categoría</button>
              </form>
            )}
  
            {/* 📌 Lista de categorías */}
            <div className="categories-list-container">
                <ul className="categories-list">
                    {categories.map((c) => (
                        <li key={c.id}>
                            <span>{c.nombre} - {c.descripcion}</span>
                            <div>
                                <button 
                                    className="edit-btn" 
                                    onClick={() => setEditingCategory(c)}>
                                    Editar
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteCategory(c.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


  
            {/* 📌 Formulario para editar categoría */}
            {editingCategory && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateCategory(editingCategory);
                }}
                className="edit-category-form"
              >
                <h3>✏ Editar Categoría</h3>
                <input
                  type="text"
                  value={editingCategory.nombre}
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (protección básica contra XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Solo permitir letras, espacios y acentos (sin números ni símbolos especiales)
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;
                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ El nombre de la categoría solo puede contener letras y espacios.");
                      return;
                    }

                    // 3️⃣ Eliminar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima (al menos 3 caracteres)
                    if (value.length > 0 && value.length < 3) {
                      setError("⚠️ El nombre de la categoría debe tener al menos 3 caracteres.");
                    } else {
                      setError(""); // Limpiar error si es válido
                    }

                    // 5️⃣ Guardar nombre validado
                    setEditingCategory({ ...editingCategory, nombre: value });
                  }}
                />

                <input
                  type="text"
                  value={editingCategory.descripcion}
                  required
                  onChange={(e) => {
                    let value = e.target.value;

                    // 1️⃣ Eliminar etiquetas HTML (protección básica contra XSS)
                    value = value.replace(/<[^>]*>?/g, "");

                    // 2️⃣ Permitir solo letras, números, espacios y signos básicos (, . -)
                    const regexPermitidos = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,\-() ]*$/;
                    if (!regexPermitidos.test(value)) {
                      setError("⚠️ La descripción solo puede contener letras, números, espacios y signos básicos (, . - ()).");
                      return;
                    }

                    // 3️⃣ Eliminar espacios iniciales
                    value = value.trimStart();

                    // 4️⃣ Validar longitud mínima
                    if (value.length > 0 && value.length < 10) {
                      setError("⚠️ La descripción debe tener al menos 10 caracteres.");
                    } else {
                      setError(""); // Limpiar error si es válida
                    }

                    // 5️⃣ Guardar descripción validada
                    setEditingCategory({ ...editingCategory, descripcion: value });
                  }}
                />

                <button type="submit">Actualizar Categoría</button>
                <button type="button" onClick={() => setEditingCategory(null)}>
                  Cancelar
                </button>
              </form>
            )}

          </>
        )}
      </div>
    </div>
  );
  
}

export default ProductManagement;
