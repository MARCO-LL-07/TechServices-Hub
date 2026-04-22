import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { resolveImageUrl } from "../services/api";

// Estilos para las notificaciones
const notificationStyles = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '15px 20px',
  borderRadius: '8px',
  color: 'white',
  zIndex: 1050,
  minWidth: '300px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
  transform: 'translateX(110%)',
  opacity: 0,
};

const successStyle = { ...notificationStyles, backgroundColor: '#28a745' };
const errorStyle = { ...notificationStyles, backgroundColor: '#dc3545' };
const infoStyle = { ...notificationStyles, backgroundColor: '#17a2b8' };

function AdminCars() {
  const navigate = useNavigate();
  const [carros, setCarros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [loadingCars, setLoadingCars] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    año: "",
    categoria_id: "",
    placa: "",
    precio_por_dia: "",
    estado: "disponible",
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    if (notification) {
      // Animar la entrada
      setTimeout(() => {
        const el = document.getElementById('notification-banner');
        if (el) {
          el.style.transform = 'translateX(0)';
          el.style.opacity = 1;
        }
      }, 10);

      // Ocultar después de 5 segundos
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    const el = document.getElementById('notification-banner');
    if (el) {
      el.style.transform = 'translateX(110%)';
      el.style.opacity = 0;
      setTimeout(() => setNotification(null), 300);
    } else {
      setNotification(null);
    }
  };

  const fetchCarros = useCallback(async () => {
    try {
      setLoadingCars(true);
      const response = await api.get("/cars", {
        params: {
          search: search || undefined,
          categoria: filtroCategoria || undefined
        }
      });
      setCarros(response.data);
    } catch (error) {
      console.error("Error al obtener carros:", error);
      showNotification("Error cargando la lista de carros.", "error");
    } finally {
      setLoadingCars(false);
    }
  }, [search, filtroCategoria]);

  const fetchCategorias = useCallback(async () => {
    try {
      setLoadingCategorias(true);
      const response = await api.get("/categories");
      setCategorias(response.data || []);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
      showNotification("Error cargando las categorías.", "error");
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCarros();
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [fetchCarros]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const guardarCarro = async (e) => {
    e.preventDefault();
    if (!form.marca || !form.modelo || !form.año || !form.placa || !form.precio_por_dia) {
      showNotification("Por favor, complete todos los campos obligatorios.", "error");
      return;
    }

    setSubmitting(true);

    // Usamos FormData para enviar archivos y texto juntos
    const formData = new FormData();
    formData.append("marca", form.marca);
    formData.append("modelo", form.modelo);
    formData.append("año", form.año);
    formData.append("placa", form.placa);
    formData.append("precio_por_dia", form.precio_por_dia);
    formData.append("estado", form.estado);
    if (form.categoria_id) {
      formData.append("categoria_id", form.categoria_id);
    }
    if (imageFile) {
      formData.append("imagen", imageFile);
    }

    try {
      if (editando) {
        await api.put(`/cars/${editando}`, formData);
        showNotification("Carro actualizado con éxito.", "success");
      } else {
        await api.post("/cars", formData);
        showNotification("Carro agregado con éxito.", "success");
      }
      
      await fetchCarros();
      resetForm();

    } catch (error) {
      console.error("Error al guardar carro:", error);
      const detail = error?.response?.data?.message || error.message || "Error desconocido.";
      showNotification(`Error al guardar: ${detail}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const editarCarro = (carro) => {
    setForm({
      marca: carro.marca || "",
      modelo: carro.modelo || "",
      año: carro.año || "",
      categoria_id: carro.categoria_id || "",
      placa: carro.placa || "",
      precio_por_dia: carro.precio_por_dia || "",
      estado: carro.estado || "disponible",
      // Ya no necesitamos 'imagen_url' en el estado del formulario
    });
    setImageFile(null);
    setEditando(carro.id);
    window.scrollTo(0, 0); // Mover la vista al formulario
  };

  const eliminarCarro = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este carro?")) {
      try {
        await api.delete(`/cars/${id}`);
        showNotification("Carro eliminado con éxito.", "success");
        fetchCarros();
      } catch (error) {
        console.error("Error al eliminar carro:", error);
        showNotification("Error al eliminar el carro.", "error");
      }
    }
  };
  
  const resetForm = () => {
    setForm({
      marca: "",
      modelo: "",
      año: "",
      categoria_id: "",
      placa: "",
      precio_por_dia: "",
      estado: "disponible",
    });
    setImageFile(null);
    setEditando(null);
  };

  const disponibles = carros.filter((c) => c.estado === "disponible").length;
  const alquilados = carros.filter((c) => c.estado === "alquilado").length;
  const mantenimiento = carros.filter((c) => c.estado === "mantenimiento").length;

  return (
    <div className="container mt-4">
      {notification && (
        <div
          id="notification-banner"
          style={
            notification.type === 'success' ? successStyle :
            notification.type === 'error' ? errorStyle :
            infoStyle
          }
          onClick={hideNotification}
        >
          {notification.message}
        </div>
      )}

      <h2>🚗 Gestión de Carros</h2>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-outline-primary" onClick={() => navigate("/admin")}>Volver al Panel</button>
        <button className="btn btn-outline-dark" onClick={() => navigate("/admin/rentals")}>Alquileres</button>
        <button className="btn btn-outline-success" onClick={() => navigate("/admin/payments")}>Pagos</button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/admin/users")}>Usuarios</button>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <div className="alert alert-success">Disponibles: {disponibles}</div>
        </div>
        <div className="col-md-3">
          <div className="alert alert-warning">Alquilados: {alquilados}</div>
        </div>
        <div className="col-md-3">
          <div className="alert alert-info">Mantenimiento: {mantenimiento}</div>
        </div>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por marca o modelo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-3">
        <select
          className="form-select"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          disabled={loadingCategorias}
        >
          <option value="">Todas las categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="card p-3 shadow mb-4">
        <h5>{editando ? "Editar Carro" : "Agregar Carro"}</h5>
        <form className="row" onSubmit={guardarCarro}>
          <div className="col-md-4">
            <input type="text" name="marca" placeholder="Marca" className="form-control mb-2" value={form.marca} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="text" name="modelo" placeholder="Modelo" className="form-control mb-2" value={form.modelo} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="number" name="año" placeholder="Año" className="form-control mb-2" value={form.año} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <select name="categoria_id" className="form-control mb-2" value={form.categoria_id} onChange={handleChange}>
              <option value="">Sin categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <input type="text" name="placa" placeholder="Placa" className="form-control mb-2" value={form.placa} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <input type="number" name="precio_por_dia" placeholder="Precio por día" className="form-control mb-2" value={form.precio_por_dia} onChange={handleChange} required />
          </div>
          <div className="col-md-4">
            <select name="estado" className="form-control mb-2" value={form.estado} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="alquilado">Alquilado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">Subir nueva imagen</label>
            <input type="file" name="imagen" accept="image/*" className="form-control mb-2" onChange={handleImageChange} />
            {editando && <small className="form-text text-muted">Dejar en blanco para conservar la imagen actual.</small>}
          </div>
          <div className="col-12 d-flex justify-content-end gap-2">
            {editando && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar Edición</button>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : (editando ? 'Actualizar Carro' : 'Agregar Carro')}
            </button>
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Placa</th>
              <th>Precio/Día</th>
              <th>Estado</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingCars ? (
              <tr><td colSpan="9" className="text-center">Cargando carros...</td></tr>
            ) : carros.length > 0 ? (
              carros.map((carro) => (
                <tr key={carro.id}>
                  <td>{carro.id}</td>
                  <td>{carro.marca}</td>
                  <td>{carro.modelo}</td>
                  <td>{carro.año}</td>
                  <td>{carro.placa}</td>
                  <td>S/. {parseFloat(carro.precio_por_dia).toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${carro.estado === 'disponible' ? 'success' : carro.estado === 'alquilado' ? 'warning' : 'info'}`}>
                      {carro.estado}
                    </span>
                  </td>
                  <td>
                    {carro.imagen_url ? (
                      <img src={resolveImageUrl(carro.imagen_url)} alt={`${carro.marca} ${carro.modelo}`} style={{ width: '100px', height: 'auto', borderRadius: '5px' }} />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarCarro(carro)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarCarro(carro.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9" className="text-center">No se encontraron carros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCars;