import express from "express";
import {
  getAllObras,
  getObraById,
  new_proyect,
  deletePartida,
  deleteSubpartida,
  updateSubpartidaFecha,
  updatePartidaFecha,
  getObrasByUser,
  getMayoresRetrasos,
  deletePartidaEdificio,
  deleteSubpartidaEdificio,
  updateEdificioFecha,
  getObrasName,
  eliminarProyecto,
  actualizarEtapasEdificios,
  getObrasOnlyName,
} from "../controllers/obra.controller.js";
import { auth, verifyRole } from "../middlewares/auth.middleware.js";
import { vista_general } from "../libs/vista_general.js";
import { updateDateHierarchyMiddleware } from "../middlewares/obra.middleware.js";

const router = express.Router();

// Ruta para obtener todas las obras (protegida, solo para Director y Coordinación)
router.get(
  "/allObras",
  auth,
  verifyRole(["Director", "Coordinador", "Control", "Obra"]),
  getAllObras
);

// Ruta para obtener una obra por ID (protegida, accesible para todos los perfiles autenticados)
router.get("/obras/:id", getObraById);

// Ruta para crear una nueva obra (protegida, solo para Director y Coordinación)
router.post("/nueva", new_proyect);

// Ruta para obtener las obras asignadas al usuario (protegida)

router.get("/mis-obras", getObrasByUser);

router.get("/obras/:obraId/mayores-retrasos", getMayoresRetrasos);

//Ruta para eliminar una partida
router.delete("/deletePartida", deletePartida);

//Ruta para eliminar una subpartida
router.delete("/deleteSubpartida", deleteSubpartida);

//Ruta para fechas de una subpartida
router.post("/fechaSubpartida", updateSubpartidaFecha);

//Ruta para fechas de una partida
router.post("/fechaPartida", updatePartidaFecha);

//Ruta para eliminar Partida de Edificio
router.delete("/deletePartidaEdificio", deletePartidaEdificio);

//Ruta para eliminar Subpartida de Edificio
router.delete("/deleteSubpartidaEdificio", deleteSubpartidaEdificio);

//Ruta para fechas de edificio
router.post("/fechaEdificio", updateEdificioFecha);

router.get("/general/:obra", vista_general);

router.post("/updateEje", updateDateHierarchyMiddleware);

router.get(
  "/ObrasAllNames",
  auth,
  verifyRole(["Director", "Coordinador", "Control", "Obra"]),
  getObrasName
);

router.get("/ObrasAllNamesNoProtect", getObrasOnlyName);

router.delete("/DeleteObra/:id", eliminarProyecto);

router.post("/EdificiosEtapas/:id/etapas", actualizarEtapasEdificios);

export default router;
