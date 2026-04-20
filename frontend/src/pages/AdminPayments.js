import { useState } from "react";

function AdminPayments() {

  const [payments, setPayments] = useState([

    {
      id: 1,
      alquiler_id: 1,
      monto: 840,
      metodo_pago: "tarjeta",
      estado: "pagado",
      fecha_pago: "2026-05-01"
    },

    {
      id: 2,
      alquiler_id: 2,
      monto: 360,
      metodo_pago: "efectivo",
      estado: "pendiente",
      fecha_pago: "2026-05-03"
    }

  ]);

  const [search, setSearch] = useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("todos");

  // Cambiar estado pago

  const cambiarEstado = (id, nuevoEstado) => {

    const actualizados =
      payments.map((p) =>
        p.id === id
          ? { ...p, estado: nuevoEstado }
          : p
      );

    setPayments(actualizados);

  };

  // FILTRO

  const filtrados =
    payments.filter((p) => {

      const coincideBusqueda =
        p.metodo_pago
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const coincideEstado =
        filtroEstado === "todos" ||
        p.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );

    });

  // TOTAL GANANCIAS

  const totalGanancias =
    payments
      .filter((p) =>
        p.estado === "pagado"
      )
      .reduce(
        (acc, p) =>
          acc + p.monto,
        0
      );

  return (

    <div className="container mt-4">

      <h2>
        💰 Gestión de Pagos
      </h2>

      {/* Total */}

      <div className="alert alert-success">

        Total Ganancias: S/. {totalGanancias}

      </div>

      {/* Buscador */}

      <div className="row mb-3">

        <div className="col-md-6">

          <input
            type="text"
            className="form-control"
            placeholder="Buscar método pago..."
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="col-md-4">

          <select
            className="form-control"
            onChange={(e) =>
              setFiltroEstado(
                e.target.value
              )
            }
          >

            <option value="todos">
              Todos
            </option>

            <option value="pagado">
              Pagado
            </option>

            <option value="pendiente">
              Pendiente
            </option>

            <option value="fallido">
              Fallido
            </option>

          </select>

        </div>

      </div>

      {/* TABLA */}

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

          {filtrados.length === 0 && (

            <tr>

              <td colSpan="7" className="text-center">

                No hay pagos registrados

              </td>

            </tr>

          )}

          {filtrados.map((p) => (

            <tr key={p.id}>

              <td>{p.id}</td>

              <td>{p.alquiler_id}</td>

              <td>S/. {p.monto}</td>

              <td>{p.metodo_pago}</td>

              <td>

                <span
                  className={
                    p.estado === "pagado"
                      ? "badge bg-success"
                      : p.estado === "pendiente"
                      ? "badge bg-warning"
                      : "badge bg-danger"
                  }
                >

                  {p.estado}

                </span>

              </td>

              <td>{p.fecha_pago}</td>

              <td>

                {p.estado === "pendiente" && (

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      cambiarEstado(
                        p.id,
                        "pagado"
                      )
                    }
                  >

                    Marcar Pagado

                  </button>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminPayments;