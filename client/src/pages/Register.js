import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();

    if (nombre && correo && password) {
      try {
        await api.post("/users/register", { nombre, correo, password });
        alert("Usuario registrado exitosamente");
        navigate("/");
      } catch (error) {
        console.error("Error en el registro:", error);
        alert("Error en el registro. Por favor, inténtalo de nuevo.");
      }
    }

  };

  return (

    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div className="card shadow p-4" style={{ width: "400px" }}>

        <h3 className="text-center mb-4">

          📝 Registro

        </h3>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
          />

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

          <button className="btn btn-primary w-100">

            Registrarse

          </button>

        </form>

      </div>

    </div>

  );

}

export default Register;