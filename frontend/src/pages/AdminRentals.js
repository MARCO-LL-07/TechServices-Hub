import { useState } from "react";

function AdminRentals() {

  const [rentals, setRentals] = useState([

    {
      id: 1,
      usuario: "Juan Pérez",
      carro: "Toyota Corolla",
      fecha_inicio: "2026-05-01",
      fecha_fin: "2026-05-07",
      total_dias: 7,
      total_pago: 840,
      estado: "activo"
    },

    {
      id: 2,
      usuario: "Ana Torres",
      carro: "Kia Sportage",
      fecha_inicio: "2026-05-03",
      fecha_fin: "2026-05-05",
      total_dias: 2,
      total_pago: 360,
      estado: "finalizado"
    }

  ]);

  const [search, setSearch] = useState("");

  const [filtroEstado, setFiltroEstado] =
    useState("todos");

  // Cambiar estado REAL

  const cambiarEstado = (id, nuevoEstado) => {

    const actualizados =
      rentals.map((r) =>
        r.id === id
          ? { ...r, estado: nuevoEstado }
          : r
      );

    setRentals(actualizados);

  };

  // FILTRO BUSCADOR

  const filtrados =
    rentals.filter((r) => {

      const coincideBusqueda =
        r.usuario
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const coincideEstado =
        filtroEstado === "todos" ||
        r.estado === filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );

    });

  // CONTADOR

  const activos =
    rentals.filter(
      (r) => r.estado === "activo"
    ).length;

  return (

    <div className="container mt-4">

      <h2>
        📋 Gestión de Alquileres
      </h2>

      {/* Estadísticas */}

      <div className="alert alert-info">

        Alquileres Activos: {activos}

      </div>

      {/* Buscador */}

      <div className="row mb-3">

        <div className="col-md-6">

          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuario..."
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

            <option value="activo">
              Activo
            </option>

            <option value="finalizado">
              Finalizado
            </option>

            <option value="cancelado">
              Cancelado
            </option>

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
            <th>Días</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {filtrados.length === 0 && (

            <tr>

              <td colSpan="9" className="text-center">

                No hay alquileres registrados

              </td>

            </tr>

          )}

          {filtrados.map((r) => (

            <tr key={r.id}>

              <td>{r.id}</td>

              <td>{r.usuario}</td>

              <td>{r.carro}</td>

              <td>{r.fecha_inicio}</td>

              <td>{r.fecha_fin}</td>

              <td>{r.total_dias}</td>

              <td>S/. {r.total_pago}</td>

              <td>

                <span
                  className={
                    r.estado === "activo"
                      ? "badge bg-success"
                      : r.estado === "finalizado"
                      ? "badge bg-secondary"
                      : "badge bg-danger"
                  }
                >

                  {r.estado}

                </span>

              </td>

              <td>

                {r.estado === "activo" && (

                  <>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        cambiarEstado(
                          r.id,
                          "finalizado"
                        )
                      }
                    >

                      Finalizar

                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        cambiarEstado(
                          r.id,
                          "cancelado"
                        )
                      }
                    >

                      Cancelar

                    </button>

                  </>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminRentals;