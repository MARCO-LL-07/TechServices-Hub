import { resolveImageUrl } from "../services/api";

function CarCard({ car }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <img
          src={resolveImageUrl(car.imagen_url)}
          className="card-img-top"
          alt={`${car.marca} ${car.modelo}`}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {car.marca} {car.modelo}
          </h5>
          <p className="card-text">
            Año: {car.año}
          </p>
          <p>
            Precio por día: S/. {parseFloat(car.precio_por_dia).toFixed(2)}
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