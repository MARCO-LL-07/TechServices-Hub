import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", { correo, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (String(user.rol).toLowerCase() === "admin") {
        navigate("/admin");
      } else {
        navigate("/client-home");
      }
    } catch (error) {
      alert("Credenciales incorrectas o error en el servidor.");
      console.error("Error en el login:", error);
    }
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