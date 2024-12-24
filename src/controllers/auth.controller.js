import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import Obra from "../models/db.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const register = async (req, res) => {
  try {
    const { email, password, nombre, apellido, perfil, vista_de_obra } =
      req.body;

    // Verificar si el usuario ya existe
    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({ message: ["El email ya está en uso"] });

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Procesar y validar vista_de_obra
    let obrasAsignadas = [];
    if (perfil !== "Director" && perfil !== "Coordinador") {
      if (typeof vista_de_obra === "string") {
        // Convertir cadena separada por comas a arreglo
        obrasAsignadas = vista_de_obra
          .split(",")
          .map((obraId) => obraId.trim());
      } else if (Array.isArray(vista_de_obra)) {
        obrasAsignadas = vista_de_obra;
      } else {
        return res.status(400).json({
          message:
            "El campo vista_de_obra debe ser un arreglo o cadena de IDs válidos",
        });
      }

      // Validar que todos los IDs son válidos ObjectIds
      if (!obrasAsignadas.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        return res
          .status(400)
          .json({ message: "Uno o más IDs de obras no son válidos" });
      }

      // Verificar que las obras existen en la base de datos
      const obras = await Obra.find({ _id: { $in: obrasAsignadas } });
      if (obras.length !== obrasAsignadas.length) {
        return res.status(400).json({
          message:
            "Algunas de las obras seleccionadas no existen en la base de datos",
        });
      }
    }

    // Crear un nuevo usuario con los campos adicionales
    const newUser = new User({
      email,
      password: passwordHash,
      nombre,
      apellido,
      perfil,
      vista_de_obra: obrasAsignadas,
    });

    // Guardar el usuario
    const userSaved = await newUser.save();

    // Crear un token de acceso
    const token = await createAccessToken({ id: userSaved._id });

    // Devolver la respuesta con los datos del usuario y el token
    res.json({
      id: userSaved._id,
      email: userSaved.email,
      nombre: userSaved.nombre,
      apellido: userSaved.apellido,
      perfil: userSaved.perfil,
      vista_de_obra: userSaved.vista_de_obra,
      token: token,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({ message: ["The email does not exist"] });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: ["The password or email is incorrect"] });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.json({
      id: userFound._id,
      email: userFound.email,
      token: token,
      isadmin: userFound.isAdmin ? userFound.isAdmin : undefined,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.send("sin token proporcinado");

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    sameSite: "none",
  });

  if (req.cookies.isadmin) {
    res.cookie("isadmin", "", {
      secure: true,
      expires: new Date(0),
      sameSite: "none",
    });
  }

  return res.status(200).json({ message: "Logged out successfully" });
};

export const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, TOKEN_SECRET, async (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      try {
        const userFound = await User.findById(user.id);
        if (!userFound) {
          return res.status(404).json({ message: "User not found" });
        }

        return res.json({
          id: userFound._id,
          email: userFound.email,
          nombre: userFound.nombre,
          apellido: userFound.apellido,
          perfil: userFound.perfil,
          vista_de_obra: userFound.vista_de_obra,
          isAdmin: userFound.isAdmin,
        });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { nombre, apellido, perfil, vista_de_obra } = req.body;
    const { id } = req.params;

    // Validar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Convertir y validar vista_de_obra
    let obrasAsignadas = [];
    if (perfil !== "Director" && perfil !== "Coordinador") {
      if (typeof vista_de_obra === "string") {
        // Convertir cadena separada por comas a arreglo
        obrasAsignadas = vista_de_obra
          .split(",")
          .map((obraId) => obraId.trim());
      } else if (Array.isArray(vista_de_obra)) {
        obrasAsignadas = vista_de_obra;
      } else {
        return res.status(400).json({
          message:
            "El campo vista_de_obra debe ser un arreglo o cadena de IDs válidos",
        });
      }

      // Validar que todos los IDs son válidos ObjectIds
      if (!obrasAsignadas.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        return res
          .status(400)
          .json({ message: "Uno o más IDs de obras no son válidos" });
      }
    }

    // Agregar log para depuración
    console.log("Obras asignadas procesadas:", obrasAsignadas);

    // Verificar que las obras existen en la base de datos
    const obras = await Obra.find({ _id: { $in: obrasAsignadas } });
    if (obras.length !== obrasAsignadas.length) {
      return res.status(400).json({
        message:
          "Algunas de las obras seleccionadas no existen en la base de datos",
      });
    }

    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        nombre,
        apellido,
        perfil,
        vista_de_obra: obrasAsignadas,
        updatedAt: new Date(),
      },
      { new: true } // Retorna el documento actualizado
    );

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error al editar usuario:", error);

    // Manejar errores específicos
    if (error.message.startsWith("Obra inválida")) {
      return res.status(400).json({ message: error.message });
    } else if (
      error.message.startsWith("Algunas de las obras seleccionadas no existen")
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Error al editar usuario" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "vista_de_obra",
      select: "Nombre",
    });

    // Encuentra todos los usuarios

    // Si no hay usuarios, devuelve un mensaje
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Devuelve los usuarios
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteuser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error eliminando el usuario:", error);
    res.status(500).json({ message: "Error eliminando el usuario" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar el usuario por su ID, incluyendo la referencia a "vista_de_obra"
    const user = await User.findById(userId).populate("vista_de_obra");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el usuario se encuentra, devolverlo
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
