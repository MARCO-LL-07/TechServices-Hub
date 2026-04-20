function CarCard({ car }) {

  return (

    <div className="col-md-4 mb-4">

      <div className="card shadow-sm h-100">

        <img
          src={car.image}
          className="card-img-top"
          alt={car.name}
        />

        <div className="card-body">

          <h5 className="card-title">
            {car.name}
          </h5>

          <p className="card-text">
            Marca: {car.brand}
          </p>

          <p>
            Precio por día: S/. {car.price}
          </p>

          <button className="btn btn-primary">

            Alquilar

          </button>

        </div>

      </div>

    </div>

  );

}

export default CarCard;