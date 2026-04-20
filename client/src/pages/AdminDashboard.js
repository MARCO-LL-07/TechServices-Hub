import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_carros: 0,
    disponibles: 0,
    alquilados: 0,
    mantenimiento: 0,
    ganancias: 0,
    total_alquileres: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Asumiendo que tienes un endpoint que devuelve estas estadísticas
        const response = await api.get("/stats/dashboard");
        setStats(response.data);
      } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        // Opcional: mostrar un mensaje de error
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2>📊 Panel Administrador</h2>

      {/* Estadísticas */}
      <div className="row mt-4">
        <div className="col-md-2">
          <div className="card p-3 shadow text-center">
            <h6>Total Carros</h6>
            <h3>{stats.total_carros}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 shadow text-center">
            <h6>Disponibles</h6>
            <h3>{stats.disponibles}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 shadow text-center">
            <h6>Alquilados</h6>
            <h3>{stats.alquilados}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 shadow text-center">
            <h6>Mantenimiento</h6>
            <h3>{stats.mantenimiento}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 shadow text-center">
            <h6>Alquileres</h6>
            <h3>{stats.total_alquileres}</h3>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card p-3 shadow text-center bg-success text-white">
            <h6>Ganancias</h6>
            <h3>S/. {stats.ganancias}</h3>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-5">
        <h4>⚙️ Gestión del Sistema</h4>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/admin/cars")}
          >
            🚗 Gestionar Carros
          </button>
          <button
            className="btn btn-dark me-2"
            onClick={() => navigate("/admin/rentals")}
          >
            📋 Ver Alquileres
          </button>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/admin/payments")}
          >
            💰 Ver Pagos
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/users")}
          >
            👥 Ver Usuarios
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;