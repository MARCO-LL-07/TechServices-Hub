import { useState } from "react";

function AdminUsers() {

  const [users] = useState([

    {
      id: 1,
      nombre: "Administrador",
      correo: "admin@admin.com",
      rol: "admin",
      creado_en: "2026-05-01"
    },

    {
      id: 2,
      nombre: "Juan Pérez",
      correo: "juan@gmail.com",
      rol: "cliente",
      creado_en: "2026-05-02"
    }

  ]);

  const [search, setSearch] = useState("");

  const filtrados =
    users.filter((u) =>
      u.nombre
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div className="container mt-4">

      <h2>
        👥 Gestión de Usuarios
      </h2>

      {/* Buscador */}

      <div className="mb-3">

        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre..."
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Tabla */}

      <table className="table table-striped">

        <thead className="table-dark">

          <tr>

            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Creado en</th>

          </tr>

        </thead>

        <tbody>

          {filtrados.map((u) => (

            <tr key={u.id}>

              <td>{u.id}</td>

              <td>{u.nombre}</td>

              <td>{u.correo}</td>

              <td>

                <span
                  className={
                    u.rol === "admin"
                      ? "badge bg-danger"
                      : "badge bg-primary"
                  }
                >

                  {u.rol}

                </span>

              </td>

              <td>{u.creado_en}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminUsers;