import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ClientHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [carros, setCarros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
  const assetBaseUrl = useMemo(() => apiBase.replace(/\/api\/?$/, ""), [apiBase]);

  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    try {
      const asset = new URL(assetBaseUrl);
      if (asset.protocol !== window.location.protocol) {
        return `${window.location.protocol}//${window.location.host}${url}`;
      }
    } catch (e) {
      // fall back
    }
    // If image is served from local uploads, add a cache-busting query param
    if (url.startsWith('/uploads/')) {
      return `${assetBaseUrl}${url}?t=${Date.now()}`;
    }
    return `${assetBaseUrl}${url}`;
  };

  const fetchCarros = useCallback(async () => {
    try {
      setLoadingCars(true);
      const response = await api.get("/cars", {
        params: {
          search: search || undefined,
          categoria: categoria || undefined
        }
      });
      console.debug('ClientHome fetchCarros response:', response.data);
      setCarros(response.data || []);
    } catch (error) {
      console.error("Error al obtener los carros:", error);
      alert("No se pudieron cargar los vehiculos.");
    } finally {
      setLoadingCars(false);
    }
  }, [search, categoria]);

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

  const filteredCars = carros;

  const handleAlquilar = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("Debes iniciar sesión para alquilar un auto.");
        return;
      }
      
      // Asumiendo que quieres alquilar por 1 día como ejemplo
      const alquilerData = {
        carro_id: id,
        cliente_id: user.id,
        fecha_inicio: new Date().toISOString().split('T')[0], // Hoy
        fecha_fin: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], // Mañana
        costo_total: filteredCars.find(c => c.id === id).precio_por_dia
      };

      await api.post("/rentals", alquilerData);
      alert("Auto alquilado con éxito. ID: " + id);
      // Opcional: actualizar la lista de carros para reflejar el cambio de estado
    } catch (error) {
      console.error("Error al alquilar el auto:", error);
      alert("Error al procesar el alquiler.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🚗 Vehículos Disponibles</h2>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-outline-primary" onClick={() => navigate("/client")}>Ir a Mi Panel</button>
        <button className="btn btn-outline-secondary" onClick={fetchCarros}>Recargar Lista</button>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar por marca o modelo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="form-select mb-4"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        disabled={loadingCategorias}
      >
        <option value="">Todas las categorias</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>

      <div className="row">
        {loadingCars ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status" aria-hidden="true" />
            <span className="ms-2">Consultando base de datos...</span>
          </div>
        ) : filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id} className="col-md-4 mb-4">
              <div className="card shadow">
                {car.imagen_url && (
                  <img
                    src={resolveImageUrl(car.imagen_url)}
                    className="card-img-top"
                    alt={`${car.marca} ${car.modelo}`}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5>
                    {car.marca} {car.modelo}
                  </h5>
                  <p>Año: {car.año}</p>
                  <p>Estado: <span className={car.estado === 'disponible' ? 'text-success' : 'text-danger'}>{car.estado}</span></p>
                  <p>
                    Precio por día: S/. {car.precio_por_dia}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAlquilar(car.id)}
                    disabled={car.estado !== 'disponible'}
                  >
                    {car.estado === 'disponible' ? 'Alquilar' : 'No Disponible'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron vehículos con ese criterio.</p>
        )}
      </div>
    </div>
  );
}

export default ClientHome;