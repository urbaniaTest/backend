import Obra from "../models/db.model.js";
import mongoose from "mongoose";

export const updateDateHierarchyMiddleware = async (req, res) => {
  try {
    const {
      obra,
      index,
      partida,
      subpartida,
      fecha,
      tipo,
      indexEdificio,
      nivel = "Subpartida",
    } = req.body;

    // Validaciones iniciales
    if (!obra) {
      return res.status(400).json({ message: "ID de obra es requerido" });
    }

    if (!["Inicio", "Fin"].includes(tipo)) {
      return res.status(400).json({
        message: "El tipo debe ser 'Inicio' o 'Fin'",
      });
    }

    // Buscar la obra
    const obra_find = await Obra.findById(obra);

    if (!obra_find) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    // Función para comparar fechas ignorando la hora
    const esMismoDia = (fecha1, fecha2) => {
      if (!fecha1 || !fecha2) return false;
      const d1 = new Date(fecha1);
      const d2 = new Date(fecha2);
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    // Función para verificar si una fecha está fuera del rango
    const estaFueraDeRango = (fechaNueva, fechaInicioPadre, fechaFinPadre) => {
      const nuevaFecha = new Date(fechaNueva);
      const inicioRango = new Date(fechaInicioPadre);
      const finRango = new Date(fechaFinPadre);

      return tipo === "Inicio"
        ? nuevaFecha < inicioRango
        : nuevaFecha > finRango;
    };

    // Función para actualizar fechas recursivamente
    const updateFechasRecursivamente = (elemento, nuevaFecha, nivelActual) => {
      // Asegurar que exista el objeto Fechas
      if (!elemento.Fechas) {
        elemento.Fechas = {
          Plan: { Inicio: null, Fin: null },
          Ejecucion: { Inicio: null, Fin: null },
        };
      }

      // Comparar y actualizar fechas de Ejecución
      const fechaActual = elemento.Fechas.Ejecucion[tipo];

      if (!fechaActual || !esMismoDia(fechaActual, nuevaFecha)) {
        // Actualizar fecha de ejecución
        elemento.Fechas.Ejecucion[tipo] = nuevaFecha;

        return { updated: true, fecha: nuevaFecha };
      }

      return { updated: false, fecha: fechaActual };
    };

    // Función para actualizar fechas de la partida padre
    const actualizarFechasPadre = (
      obra,
      indexEtapa,
      nombrePartida,
      tipoFecha,
      indexEdificio,
      nuevaFecha
    ) => {
      const ruta =
        indexEdificio !== undefined
          ? obra.Edificios[indexEdificio]?.Partidas
          : obra.Etapas[indexEtapa].Partidas;

      const partida = ruta.find((p) => p.Nombre === nombrePartida);

      if (partida) {
        // Obtener fechas originales de la partida padre
        const fechaInicioPadre = partida.Fechas?.Ejecucion?.Inicio;
        const fechaFinPadre = partida.Fechas?.Ejecucion?.Fin;

        // Verificar si la nueva fecha está fuera del rango original
        const fueraDeRango = estaFueraDeRango(
          nuevaFecha,
          fechaInicioPadre,
          fechaFinPadre
        );

        if (fueraDeRango) {
          // Calcular nueva fecha basada en todas las subpartidas
          const todasSubpartidas = partida.Subpartidas;
          const fechasEjecucion = todasSubpartidas
            .map((sp) => sp.Fechas?.Ejecucion?.[tipoFecha])
            .filter((f) => f); // Eliminar fechas nulas

          if (fechasEjecucion.length > 0) {
            const fechaExtrema =
              tipoFecha === "Inicio"
                ? new Date(
                    Math.min(
                      ...fechasEjecucion.map((f) => new Date(f).getTime())
                    )
                  )
                : new Date(
                    Math.max(
                      ...fechasEjecucion.map((f) => new Date(f).getTime())
                    )
                  );

            // Verificar si realmente necesita actualización
            const fechaActualPartida = partida.Fechas?.Ejecucion?.[tipoFecha];

            if (
              !fechaActualPartida ||
              !esMismoDia(fechaActualPartida, fechaExtrema)
            ) {
              // Actualizar fechas de la partida y devolver resultado
              return updateFechasRecursivamente(
                partida,
                fechaExtrema,
                "Partida"
              );
            }
          }
        }
      }

      return { updated: false };
    };

    // Función para actualizar fechas de la obra
    const actualizarFechasObra = (obra, tipoFecha) => {
      // Calcular nueva fecha basada en todas las partidas
      const todasPartidas = obra.Etapas.flatMap((etapa) => etapa.Partidas);
      const fechasEjecucion = todasPartidas
        .map((p) => p.Fechas?.Ejecucion?.[tipoFecha])
        .filter((f) => f); // Eliminar fechas nulas

      if (fechasEjecucion.length > 0) {
        const fechaExtrema =
          tipoFecha === "Inicio"
            ? new Date(
                Math.min(...fechasEjecucion.map((f) => new Date(f).getTime()))
              )
            : new Date(
                Math.max(...fechasEjecucion.map((f) => new Date(f).getTime()))
              );

        // Verificar si realmente necesita actualización
        const fechaActualObra = obra.Fechas?.Ejecucion?.[tipoFecha];

        if (!fechaActualObra || !esMismoDia(fechaActualObra, fechaExtrema)) {
          // Actualizar fechas de la obra y devolver resultado
          return updateFechasRecursivamente(obra, fechaExtrema, "Obra");
        }
      }

      return { updated: false };
    };

    // Lógica principal de actualización según el nivel
    let resultadoActualizacion = { updated: false };
    switch (nivel) {
      case "Subpartida":
        const etapa = obra_find.Etapas[index];

        const ruta =
          indexEdificio !== undefined
            ? obra_find.Edificios[indexEdificio]?.Partidas
            : etapa.Partidas;

        const partida_find = ruta.find((p) => p.Nombre === partida);
        const subpartida_find = partida_find.Subpartidas.find(
          (s) => s.Nombre === subpartida
        );

        resultadoActualizacion = updateFechasRecursivamente(
          subpartida_find,
          fecha,
          "Subpartida"
        );

        // Solo actualizar padres si hubo cambio y está fuera del rango original
        if (resultadoActualizacion.updated) {
          actualizarFechasPadre(
            obra_find,
            index,
            partida,
            tipo,
            indexEdificio,
            fecha
          );
          actualizarFechasObra(obra_find, tipo);
        }
        break;

      // El resto del código permanece igual
      // (casos de Partida y Obra)
    }

    // Guardar cambios
    await obra_find.save();

    // Responder al cliente
    res.status(200).json({
      message: "Actualización completada",
      updated: resultadoActualizacion.updated,
    });
  } catch (error) {
    console.error("Error en middleware de actualización de fechas:", error);
    res.status(500).json({
      message: "Error al actualizar la jerarquía de fechas",
      error: error.message,
    });
  }
};
