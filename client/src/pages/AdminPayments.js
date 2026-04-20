import { useState, useEffect } from "react";
import api from "../services/api";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/payments/${id}/status`, { estado: nuevoEstado });
      alert(`Pago actualizado a ${nuevoEstado}`);
      fetchPayments();
    } catch (error) {
      console.error("Error al cambiar estado del pago:", error);
      alert("Error al actualizar el estado del pago.");
    }
  };

  const filtrados = payments.filter((p) => {
    const coincideBusqueda = p.metodo_pago.toLowerCase().includes(search.toLowerCase());
    const coincideEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const totalGanancias = payments
    .filter((p) => p.estado === "pagado")
    .reduce((acc, p) => acc + parseFloat(p.monto), 0);

  return (
    <div className="container mt-4">
      <h2>💰 Gestión de Pagos</h2>
      <div className="alert alert-success">
        Total Ganancias: S/. {totalGanancias.toFixed(2)}
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por método de pago..."
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
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="fallido">Fallido</option>
          </select>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>ID Alquiler</th>
            <th>Monto</th>
            <th>Método</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No hay pagos registrados</td>
            </tr>
          ) : (
            filtrados.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.alquiler_id}</td>
                <td>S/. {p.monto}</td>
                <td>{p.metodo_pago}</td>
                <td>
                  <span
                    className={`badge bg-${
                      p.estado === "pagado" ? "success" : p.estado === "pendiente" ? "warning" : "danger"
                    }`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                <td>
                  {p.estado === "pendiente" && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => cambiarEstado(p.id, "pagado")}
                    >
                      Marcar Pagado
                    </button>
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

export default AdminPayments;