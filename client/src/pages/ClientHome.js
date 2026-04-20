import { useState, useEffect } from "react";
import api from "../services/api";

function ClientHome() {
  const [search, setSearch] = useState("");
  const [carros, setCarros] = useState([]);

  useEffect(() => {
    const fetchCarros = async () => {
      try {
        const response = await api.get("/cars");
        setCarros(response.data);
      } catch (error) {
        console.error("Error al obtener los carros:", error);
        alert("No se pudieron cargar los vehículos.");
      }
    };
    fetchCarros();
  }, []);

  const filteredCars =
    carros.filter((car) =>
      car.modelo.toLowerCase().includes(search.toLowerCase())
    );

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

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar vehículo por modelo..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row">
        {filteredCars.length > 0 ? (
          filteredCars.map((car) => (
            <div key={car.id} className="col-md-4 mb-4">
              <div className="card shadow">
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