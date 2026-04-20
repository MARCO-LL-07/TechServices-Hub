function StatsCard({ title, value }) {

  return (

    <div className="col-md-3">

      <div className="card shadow p-3">

        <h6>{title}</h6>

        <h3>{value}</h3>

      </div>

    </div>

  );

}

export default StatsCard;