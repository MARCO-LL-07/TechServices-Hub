const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

const isAdmin = (req, res, next) => {
  return verificarToken(req, res, () => {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ message: "Acceso solo para administradores" });
    }
    next();
  });
};

module.exports = {
  verificarToken,
  isAdmin
};