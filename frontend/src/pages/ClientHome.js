import { useState } from "react";

function ClientHome() {

  const [search, setSearch] = useState("");

  // Datos de prueba (luego vendrán del backend)

  const carros = [

    {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla",
      año: 2022,
      precio_por_dia: 120,
      estado: "disponible",
      color: "Rojo"
    },

    {
      id: 2,
      marca: "Kia",
      modelo: "Sportage",
      año: 2021,
      precio_por_dia: 180,
      estado: "disponible",
      color: "Negro"
    }

  ];

  const filteredCars =
    carros.filter((car) =>
      car.modelo
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const handleAlquilar = (id) => {

    alert("Auto alquilado ID: " + id);

  };

  return (

    <div className="container mt-4">

      <h2>
        🚗 Vehículos Disponibles
      </h2>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar vehículo..."
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="row">

        {filteredCars.map((car) => (

          <div
            key={car.id}
            className="col-md-4 mb-4"
          >

            <div className="card shadow">

              <div className="card-body">

                <h5>
                  {car.marca}
                  {" "}
                  {car.modelo}
                </h5>

                <p>
                  Año: {car.año}
                </p>

                <p>
                  Color: {car.color}
                </p>

                <p>
                  Precio:
                  S/. {car.precio_por_dia}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleAlquilar(car.id)
                  }
                >
                  Alquilar
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default ClientHome;