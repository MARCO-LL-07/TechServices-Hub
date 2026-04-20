import { useState, useEffect } from "react";
import api from "../services/api";

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

  const fetchCarros = async () => {
    try {
      const response = await api.get("/cars");
      setCarros(response.data);
    } catch (error) {
      console.error("Error al obtener carros:", error);
    }
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCarro = async () => {
    if (!form.marca || !form.modelo || !form.año || !form.placa || !form.precio_por_dia) {
      alert("Complete todos los campos");
      return;
    }

    try {
      if (editando) {
        await api.put(`/cars/${editando}`, form);
        alert("Carro actualizado con éxito");
      } else {
        await api.post("/cars", form);
        alert("Carro agregado con éxito");
      }
      fetchCarros();
      resetForm();
    } catch (error) {
      console.error("Error al guardar carro:", error);
      alert("Error al guardar el carro. Verifique la consola para más detalles.");
    }
  };

  const editarCarro = (carro) => {
    setForm(carro);
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
      placa: "",
      precio_por_dia: "",
      estado: "disponible"
    });
    setEditando(null);
  };

  const filtrados = carros.filter((c) =>
    c.marca.toLowerCase().includes(search.toLowerCase())
  );

  const disponibles = carros.filter((c) => c.estado === "disponible").length;
  const alquilados = carros.filter((c) => c.estado === "alquilado").length;
  const mantenimiento = carros.filter((c) => c.estado === "mantenimiento").length;

  return (
    <div className="container mt-4">
      <h2>🚗 Gestión de Carros</h2>

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
        placeholder="Buscar por marca..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card p-3 shadow mb-4">
        <h5>{editando ? "Editar Carro" : "Agregar Carro"}</h5>
        <div className="row">
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
        </div>
        <button className="btn btn-success mt-2" onClick={guardarCarro}>
          {editando ? "Actualizar" : "Agregar"}
        </button>
        {editando && <button className="btn btn-secondary mt-2" onClick={resetForm}>Cancelar Edición</button>}
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No hay carros registrados</td>
            </tr>
          ) : (
            filtrados.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.marca}</td>
                <td>{c.modelo}</td>
                <td>{c.año}</td>
                <td>{c.placa}</td>
                <td>S/. {c.precio_por_dia}</td>
                <td><span className={`badge bg-${c.estado === 'disponible' ? 'success' : c.estado === 'alquilado' ? 'warning' : 'info'}`}>{c.estado}</span></td>
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