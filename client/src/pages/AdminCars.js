import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    año: "",
    categoria_id: "",
    placa: "",
    precio_por_dia: "",
    estado: "disponible",
    imagen_url: ""
  });
  const [editando, setEditando] = useState(null);

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
  const assetBaseUrl = useMemo(() => apiBase.replace(/\/api\/?$/, ""), [apiBase]);

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${assetBaseUrl}${url}`;
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
      alert("Complete todos los campos");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("marca", form.marca);
      payload.append("modelo", form.modelo);
      payload.append("anio", form.año);
      payload.append("placa", form.placa);
      payload.append("precio_por_dia", form.precio_por_dia);
      payload.append("estado", form.estado);
      if (form.categoria_id) {
        payload.append("categoria_id", form.categoria_id);
      }
      if (imageFile) {
        payload.append("imagen", imageFile);
      }

      if (editando) {
        await api.put(`/cars/${editando}`, payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Carro actualizado con éxito");
      } else {
        await api.post("/cars", payload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Carro agregado con éxito");
      }
      await fetchCarros();
      resetForm();
    } catch (error) {
      console.error("Error al guardar carro:", error);
      alert("Error al guardar el carro. Verifique la consola para más detalles.");
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
      imagen_url: carro.imagen_url || ""
    });
    setImageFile(null);
    setEditando(carro.id);
  };

  const eliminarCarro = async (id) => {
    if (window.confirm("¿Eliminar este carro?")) {
      try {
        await api.delete(`/cars/${id}`);
        alert("Carro eliminado con éxito");
        fetchCarros();
      } catch (error) {
        console.error("Error al eliminar carro:", error);
        alert("Error al eliminar el carro.");
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
      imagen_url: ""
    });
    setImageFile(null);
    setEditando(null);
  };

  const disponibles = carros.filter((c) => c.estado === "disponible").length;
  const alquilados = carros.filter((c) => c.estado === "alquilado").length;
  const mantenimiento = carros.filter((c) => c.estado === "mantenimiento").length;

  return (
    <div className="container mt-4">
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
            <input type="text" name="marca" placeholder="Marca" className="form-control mb-2" value={form.marca} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <input type="text" name="modelo" placeholder="Modelo" className="form-control mb-2" value={form.modelo} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <input type="number" name="año" placeholder="Año" className="form-control mb-2" value={form.año} onChange={handleChange} />
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
            <input type="text" name="placa" placeholder="Placa" className="form-control mb-2" value={form.placa} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <input type="number" name="precio_por_dia" placeholder="Precio por día" className="form-control mb-2" value={form.precio_por_dia} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <select name="estado" className="form-control mb-2" value={form.estado} onChange={handleChange}>
              <option value="disponible">Disponible</option>
              <option value="alquilado">Alquilado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="col-md-6">
            <input type="file" accept="image/*" className="form-control mb-2" onChange={handleImageChange} />
          </div>
          <div className="col-md-6 d-flex align-items-end gap-2">
            <button className="btn btn-success mt-2" type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : editando ? "Actualizar" : "Agregar"}
            </button>
            {editando && (
              <button className="btn btn-secondary mt-2" type="button" onClick={resetForm}>
                Cancelar Edición
              </button>
            )}
          </div>
          {form.imagen_url && (
            <div className="col-12 mt-2">
              <small className="text-muted d-block">Imagen actual:</small>
              <img src={resolveImageUrl(form.imagen_url)} alt="actual" style={{ maxHeight: 120 }} />
            </div>
          )}
        </form>
      </div>

      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Placa</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loadingCars ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                <div className="spinner-border" role="status" aria-hidden="true" />
                <span className="ms-2">Cargando carros...</span>
              </td>
            </tr>
          ) : carros.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">No hay carros registrados</td>
            </tr>
          ) : (
            carros.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.marca}</td>
                <td>{c.modelo}</td>
                <td>{c.año}</td>
                <td>{c.placa}</td>
                <td>S/. {c.precio_por_dia}</td>
                <td><span className={`badge bg-${c.estado === 'disponible' ? 'success' : c.estado === 'alquilado' ? 'warning' : 'info'}`}>{c.estado}</span></td>
                <td>
                  {c.imagen_url ? (
                    <img src={resolveImageUrl(c.imagen_url)} alt={`${c.marca} ${c.modelo}`} style={{ width: 64, height: 40, objectFit: "cover" }} />
                  ) : (
                    <small className="text-muted">Sin imagen</small>
                  )}
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => editarCarro(c)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => eliminarCarro(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCars;