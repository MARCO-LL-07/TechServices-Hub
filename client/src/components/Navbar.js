import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between">
      <span className="navbar-brand mb-0 h1">🚗 AutoRental Hub</span>
      <div>
        {user && (
          <>
            <span className="navbar-text me-3">
              Bienvenido, {user.nombre} ({user.rol})
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;