import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {

  e.preventDefault();

  // ADMIN

  if (
    correo === "admin@admin.com" &&
    password === "123456"
  ) {

    navigate("/admin");
    return;

  }

  // CLIENTE

  if (
    correo === "cliente@cliente.com" &&
    password === "123456"
  ) {

    navigate("/client-home");
    return;

  }

  alert("Usuario no válido");

};
  return (

    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h3 className="text-center mb-4">

          🚗 AutoRental Login

        </h3>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Correo"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
            }
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button className="btn btn-dark w-100">

            Iniciar Sesión

          </button>

        </form>

        <p className="text-center mt-3">

          ¿No tienes cuenta?

          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/register")
            }
          >
            {" "}Regístrate
          </span>

        </p>

      </div>

    </div>

  );

}

export default Login;