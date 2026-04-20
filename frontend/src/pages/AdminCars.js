import { useState } from "react";

function AdminCars() {

  const [carros, setCarros] = useState([]);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    año: "",
    placa: "",
    precio_por_dia: "",
    estado: "disponible"
  });

  const [editando, setEditando] = useState(null);

  // Manejar cambios

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // Guardar carro

  const guardarCarro = () => {

    if (
      !form.marca ||
      !form.modelo ||
      !form.año ||
      !form.placa ||
      !form.precio_por_dia
    ) {

      alert("Complete todos los campos");
      return;

    }

    // validar placa duplicada

    const existePlaca =
      carros.some(
        (c) =>
          c.placa === form.placa &&
          c.id !== editando
      );

    if (existePlaca) {

      alert("La placa ya existe");
      return;

    }

    if (editando) {

      const actualizados =
        carros.map((c) =>
          c.id === editando
            ? { ...form, id: editando }
            : c
        );

      setCarros(actualizados);
      setEditando(null);

    } else {

      const nuevo = {

        id: carros.length + 1,
        creado_en: new Date()
          .toISOString()
          .slice(0, 10),
        ...form

      };

      setCarros([...carros, nuevo]);

    }

    setForm({
      marca: "",
      modelo: "",
      año: "",
      placa: "",
      precio_por_dia: "",
      estado: "disponible"
    });

  };

  // Editar

  const editarCarro = (carro) => {

    setForm(carro);
    setEditando(carro.id);

  };

  // Eliminar

  const eliminarCarro = (id) => {

    if (window.confirm("¿Eliminar este carro?")) {

      setCarros(
        carros.filter((c) =>
          c.id !== id
        )
      );

    }

  };

  // BUSCADOR

  const filtrados =
    carros.filter((c) =>
      c.marca
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // CONTADORES

  const disponibles =
    carros.filter(
      (c) => c.estado === "disponible"
    ).length;

  const alquilados =
    carros.filter(
      (c) => c.estado === "alquilado"
    ).length;

  return (

    <div className="container mt-4">

      <h2>🚗 Gestión de Carros</h2>

      {/* ESTADÍSTICAS */}

      <div className="row mb-3">

        <div className="col-md-3">
          <div className="alert alert-success">
            Disponibles: {disponibles}
          </div>
        </div>

        <div className="col-md-3">
          <div className="alert alert-warning">
            Alquilados: {alquilados}
          </div>
        </div>

      </div>

      {/* BUSCADOR */}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por marca..."
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* FORMULARIO */}

      <div className="card p-3 shadow mb-4">

        <h5>
          {editando
            ? "Editar Carro"
            : "Agregar Carro"}
        </h5>

        <div className="row">

          <div className="col-md-4">

            <input
              type="text"
              name="marca"
              placeholder="Marca"
              className="form-control mb-2"
              value={form.marca}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4">

            <input
              type="text"
              name="modelo"
              placeholder="Modelo"
              className="form-control mb-2"
              value={form.modelo}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4">

            <input
              type="number"
              name="año"
              placeholder="Año"
              className="form-control mb-2"
              value={form.año}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4">

            <input
              type="text"
              name="placa"
              placeholder="Placa"
              className="form-control mb-2"
              value={form.placa}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4">

            <input
              type="number"
              name="precio_por_dia"
              placeholder="Precio por día"
              className="form-control mb-2"
              value={form.precio_por_dia}
              onChange={handleChange}
            />

          </div>

          <div className="col-md-4">

            <select
              name="estado"
              className="form-control mb-2"
              value={form.estado}
              onChange={handleChange}
            >

              <option value="disponible">
                Disponible
              </option>

              <option value="alquilado">
                Alquilado
              </option>

              <option value="mantenimiento">
                Mantenimiento
              </option>

            </select>

          </div>

        </div>

        <button
          className="btn btn-success mt-2"
          onClick={guardarCarro}
        >

          {editando
            ? "Actualizar"
            : "Agregar"}

        </button>

      </div>

      {/* TABLA */}

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
            <th>Acciones</th>

          </tr>

        </thead>

        <tbody>

          {filtrados.length === 0 && (

            <tr>

              <td colSpan="8" className="text-center">
                No hay carros registrados
              </td>

            </tr>

          )}

          {filtrados.map((c) => (

            <tr key={c.id}>

              <td>{c.id}</td>
              <td>{c.marca}</td>
              <td>{c.modelo}</td>
              <td>{c.año}</td>
              <td>{c.placa}</td>
              <td>S/. {c.precio_por_dia}</td>
              <td>{c.estado}</td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    editarCarro(c)
                  }
                >

                  Editar

                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    eliminarCarro(c.id)
                  }
                >

                  Eliminar

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminCars;