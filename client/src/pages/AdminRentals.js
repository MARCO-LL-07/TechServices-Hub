import { useState, useEffect } from "react";
import api from "../services/api";

function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const fetchRentals = async () => {
    try {
      const response = await api.get("/rentals");
      setRentals(response.data);
    } catch (error) {
      console.error("Error al obtener alquileres:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/rentals/${id}/status`, { estado: nuevoEstado });
      alert(`Alquiler ${nuevoEstado} con éxito`);
      fetchRentals();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al actualizar el estado del alquiler.");
    }
  };

  const filtrados = rentals.filter((r) => {
    const usuario = r.Usuario ? r.Usuario.nombre : '';
    const coincideBusqueda = usuario.toLowerCase().includes(search.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || r.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const activos = rentals.filter((r) => r.estado === "activo").length;

  return (
    <div className="container mt-4">
      <h2>📋 Gestión de Alquileres</h2>
      <div className="alert alert-info">Alquileres Activos: {activos}</div>
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de usuario..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Carro</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Costo Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No hay alquileres registrados</td>
            </tr>
          ) : (
            filtrados.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.Usuario ? r.Usuario.nombre : 'N/A'}</td>
                <td>{r.Carro ? `${r.Carro.marca} ${r.Carro.modelo}`: 'N/A'}</td>
                <td>{new Date(r.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(r.fecha_fin).toLocaleDateString()}</td>
                <td>S/. {r.costo_total}</td>
                <td>
                  <span
                    className={`badge bg-${
                      r.estado === "activo" ? "success" : r.estado === "finalizado" ? "secondary" : "danger"
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td>
                  {r.estado === "activo" && (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => cambiarEstado(r.id, "finalizado")}
                      >
                        Finalizar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cambiarEstado(r.id, "cancelado")}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRentals;