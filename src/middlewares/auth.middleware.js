import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

// Middleware de autenticación
export const auth = async (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET); // Verificar el token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user; // Asignar el usuario a la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Middleware para verificar roles
export const verifyRole = (roles) => {
  return (req, res, next) => {
    // Verifica que el usuario autenticado tenga el rol adecuado
    const { perfil } = req.user; // Asume que `req.user` contiene la información del usuario

    // Verifica si el perfil del usuario está incluido en los roles permitidos
    if (!roles.includes(perfil)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta ruta" });
    }

    next(); // Continúa con el siguiente middleware
  };
};
