import Obra from "../models/db.model.js";

function agruparPartidasYSubpartidas(obra) {
  // Objeto para almacenar partidas consolidadas
  const partidasConsolidadas = {};

  // Recorrer todas las Etapas
  obra.Etapas.forEach((etapa, indexEtapa) => {
    // Procesar cada Partida en la Etapa actual
    etapa.Partidas.forEach((partida) => {
      // Si la partida no existe en el consolidado, la inicializamos
      if (!partidasConsolidadas[partida.Nombre]) {
        partidasConsolidadas[partida.Nombre] = {
          Nombre: partida.Nombre,
          Etapas: [indexEtapa],
          Subpartidas: [],
          Fechas: [],
          Dias: {
            Total_dias: {
              Plan: 0,
              Ejecucion: 0,
            },
          },
        };
      } else {
        // Si ya existe, agregamos la etapa actual si no está incluida
        if (!partidasConsolidadas[partida.Nombre].Etapas.includes(indexEtapa)) {
          partidasConsolidadas[partida.Nombre].Etapas.push(indexEtapa);
        }
      }

      // Agregar fechas de la Partida para esta Etapa
      partidasConsolidadas[partida.Nombre].Fechas.push({
        Etapa: `Etapa ${indexEtapa + 1}`,
        Plan: {
          Inicio: partida.Fechas?.Plan?.Inicio || "",
          Fin: partida.Fechas?.Plan?.Fin || "",
        },
        Ejecucion: {
          Inicio: partida.Fechas?.Ejecucion?.Inicio || "",
          Fin: partida.Fechas?.Ejecucion?.Fin || "",
        },
      });

      // Actualizar días totales de Plan y Ejecución
      const diasPlan = calcularDiasDiferencia(
        partida.Fechas?.Plan?.Inicio,
        partida.Fechas?.Plan?.Fin
      );
      const diasEjecucion = calcularDiasDiferencia(
        partida.Fechas?.Ejecucion?.Inicio,
        partida.Fechas?.Ejecucion?.Fin
      );

      partidasConsolidadas[partida.Nombre].Dias.Total_dias.Plan += diasPlan;
      partidasConsolidadas[partida.Nombre].Dias.Total_dias.Ejecucion +=
        diasEjecucion;

      // Procesar Subpartidas
      partida.Subpartidas.forEach((subpartida) => {
        // Buscar si la subpartida ya existe en la lista de Subpartidas de esta Partida
        let subpartidaExistente = partidasConsolidadas[
          partida.Nombre
        ].Subpartidas.find((sub) => sub.Nombre === subpartida.Nombre);

        // Si no existe, crear nueva subpartida
        if (!subpartidaExistente) {
          subpartidaExistente = {
            Nombre: subpartida.Nombre,
            Etapas: [indexEtapa],
            Fechas: [],
            Dias: {
              Total_dias: {
                Plan: 0,
                Ejecucion: 0,
              },
            },
          };
          partidasConsolidadas[partida.Nombre].Subpartidas.push(
            subpartidaExistente
          );
        } else {
          // Agregar etapa si no está incluida
          if (!subpartidaExistente.Etapas.includes(indexEtapa)) {
            subpartidaExistente.Etapas.push(indexEtapa);
          }
        }

        // Agregar fechas de la Subpartida
        subpartidaExistente.Fechas.push({
          Etapa: `Etapa ${indexEtapa + 1}`,
          Plan: {
            Inicio: subpartida.Fechas?.Plan?.Inicio || "",
            Fin: subpartida.Fechas?.Plan?.Fin || "",
          },
          Ejecucion: {
            Inicio: subpartida.Fechas?.Ejecucion?.Inicio || "",
            Fin: subpartida.Fechas?.Ejecucion?.Fin || "",
          },
        });

        // Calcular y actualizar días de Subpartida
        const diasSubpartidaPlan = calcularDiasDiferencia(
          subpartida.Fechas?.Plan?.Inicio,
          subpartida.Fechas?.Plan?.Fin
        );
        const diasSubpartidaEjecucion = calcularDiasDiferencia(
          subpartida.Fechas?.Ejecucion?.Inicio,
          subpartida.Fechas?.Ejecucion?.Fin
        );

        subpartidaExistente.Dias.Total_dias.Plan += diasSubpartidaPlan;
        subpartidaExistente.Dias.Total_dias.Ejecucion +=
          diasSubpartidaEjecucion;
      });
    });
  });

  // Convertir el objeto consolidado a un array
  return Object.values(partidasConsolidadas);
}

// Función auxiliar para calcular diferencia de días entre dos fechas
function calcularDiasDiferencia(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) return 0;

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  // Calcular diferencia en días
  const diferenciaMilisegundos = Math.abs(fin - inicio);
  return Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
}

export const vista_general = async (req, res) => {
  const { obra } = req.params;
  console.log(req.body);
  try {
    const obra_find = await Obra.findById(obra);
    if (!obra_find) {
      return res.status(404).json({ message: "Obra no encontrada" });
    }

    const result = agruparPartidasYSubpartidas(obra_find);
    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la subpartida", error });
  }
};

// const ejemplo_objeto = {
//     Nombre: "Obra.Etapas[index Etapa que corresponda].Partidas[inde Partida que corresponda].Nombre",
//     Etapas: "Un array en el que pongas en que etapas encontraste esta partida por ejemplo [0,1]",
//     Subpartidas: [
//         {
//             Nombre: "Obra.Etapas[index Etapa que corresponda].Partidas[inde Partida que corresponda].Subpartidas[index].Nombre",
//             Etapas: "Un array en el que pongas en que etapas encontraste esta partida por ejemplo [0,1]",
//             Fechas: { //Fechas es un objeto con todas las etapas en las que aparece la subPartida
//                 Etapa 1: { //La estructura es homonima al ejemplo
//                     Plan: {
//                         Inicio: "",
//                         Fin: ""
//                     },
//                     Ejecucion: {
//                         Inicio: "",
//                         Fin: ""
//                     }
//                 },
//                 Etapa 2: {
//                     Plan: {
//                         Inicio: "",
//                         Fin: ""
//                     },
//                     Ejecucion: {
//                         Inicio: "",
//                         Fin: ""
//                     }
//                 }
//             },
//             Dias: {
//                 Total_dias: {
//                     Plan: 0,
//                     Ejecucion: 0
//                 }
//             }
//         }
//     ]
//     Fechas: {
//         Etapa 1: {
//             Plan: {
//                 Inicio: "",
//                 Fin: ""
//             },
//             Ejecucion: {
//                 Inicio: "",
//                 Fin: ""
//             }
//         },
//         Etapa 2: {
//             Plan: {
//                 Inicio: "",
//                 Fin: ""
//             },
//             Ejecucion: {
//                 Inicio: "",
//                 Fin: ""
//             }
//         }
//     },
//     Dias: {
//         Total_dias: {
//             Plan: 0, //La suma de las fechas de todas las etapas en Plan
//             Ejecucion: 0 //La suma de las fechas de todas las etapas en Ejecucion
//         }
//     }
// }
