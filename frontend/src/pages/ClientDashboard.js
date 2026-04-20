function ClientDashboard() {

  // datos de prueba (luego vendrán del backend)

  const alquiler = {

    pedido: "ALQ-2026-001",

    marca: "Toyota",

    modelo: "Corolla",

    color: "Rojo",

    dias_totales: 7,

    dias_restantes: 3

  };

  return (

    <div className="container mt-4">

      <h2 className="mb-4">

        📋 Mi Alquiler

      </h2>

      <div className="card shadow p-4">

        <h5>

          Número de Pedido:
          {alquiler.pedido}

        </h5>

        <p>

          Marca:
          {alquiler.marca}

        </p>

        <p>

          Modelo:
          {alquiler.modelo}

        </p>

        <p>

          Color:
          {alquiler.color}

        </p>

        <p>

          Días Totales:
          {alquiler.dias_totales}

        </p>

        <p>

          Días Restantes:
          {alquiler.dias_restantes}

        </p>

      </div>

    </div>

  );

}

export default ClientDashboard;