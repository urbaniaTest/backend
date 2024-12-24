import {
  partidas_dinamicas,
  partidas_fijas,
  partidas_edificios,
} from "../schemas/partidas.schema.js";

export const crearProyecto = (
  numEtapas,
  numEdificiosPorEtapa,
  nivelesPorEdificio,
  sotanos,
  nombre,
  fecha_de_inicio,
  fecha_de_fin,
  m2_vendibles,
  m2_construccion,
  direccion
) => {
  const obtenerFechaActual = () => new Date().toISOString().split("T")[0];

  const crearPartidasGenerales = () => {
    const fijas = partidas_fijas.map((partida) => ({
      Nombre: partida.Nombre,
      Subpartidas: Array.isArray(partida.Subpartidas)
        ? partida.Subpartidas.map((subpartida) =>
            typeof subpartida === "string"
              ? {
                  Nombre: subpartida,
                  Fechas: {
                    Plan: {
                      Inicio: obtenerFechaActual(),
                      Fin: obtenerFechaActual(),
                    },
                    Ejecucion: {
                      Inicio: obtenerFechaActual(),
                      Fin: obtenerFechaActual(),
                    },
                  },
                  Etapa: 1,
                }
              : subpartida
          )
        : [],
      Fechas: {
        Plan: { Inicio: obtenerFechaActual(), Fin: obtenerFechaActual() },
        Ejecucion: { Inicio: obtenerFechaActual(), Fin: obtenerFechaActual() },
      },
    }));

    const dinamicas = [];
    for (let i = 0; i < sotanos; i++) {
      dinamicas.push(
        ...partidas_dinamicas.map((partida) => ({
          Nombre: `${partida.Nombre} ${i + 1}`,
          Fechas: {
            Plan: { Inicio: obtenerFechaActual(), Fin: obtenerFechaActual() },
            Ejecucion: {
              Inicio: obtenerFechaActual(),
              Fin: obtenerFechaActual(),
            },
          },
          Subpartidas: Array.isArray(partida.Subpartidas)
            ? partida.Subpartidas.map((subpartida) =>
                typeof subpartida === "string"
                  ? {
                      Nombre: subpartida,
                      Fechas: {
                        Plan: {
                          Inicio: obtenerFechaActual(),
                          Fin: obtenerFechaActual(),
                        },
                        Ejecucion: {
                          Inicio: obtenerFechaActual(),
                          Fin: obtenerFechaActual(),
                        },
                      },
                      Etapa: 1,
                    }
                  : subpartida
              )
            : [],
        }))
      );
    }

    return fijas.concat(dinamicas);
  };

  const crearEdificios = (niveles) => {
    return Array.from({ length: numEdificiosPorEtapa }, (_, i) => ({
      Nombre: `Edificio ${String.fromCharCode(65 + i)}`, // Edificio A, B, C, etc.
      Partidas: partidas_edificios.map((partida) => {
        // Verificar si todas las subpartidas son cadenas de texto
        const todasSonCadenas = partida.Subpartidas.every(
          (subpartida) => typeof subpartida === "string"
        );

        return {
          Nombre: partida.Nombre,
          Subpartidas: [
            // Crear todas las subpartidas
            ...partida.Subpartidas.map((subpartida) =>
              typeof subpartida === "string"
                ? {
                    Nombre: subpartida,
                    Fechas: {
                      Plan: {
                        Inicio: obtenerFechaActual(),
                        Fin: obtenerFechaActual(),
                      },
                      Ejecucion: {
                        Inicio: obtenerFechaActual(),
                        Fin: obtenerFechaActual(),
                      },
                    },
                    Etapa: 1,
                  }
                : subpartida
            ),
            // Agregar los niveles solo si todas las subpartidas son cadenas
            ...(todasSonCadenas
              ? Array.from({ length: niveles }, (_, nivelIdx) => ({
                  Nombre: `Nivel ${nivelIdx + 1}`,
                  Fechas: {
                    Plan: {
                      Inicio: obtenerFechaActual(),
                      Fin: obtenerFechaActual(),
                    },
                    Ejecucion: {
                      Inicio: obtenerFechaActual(),
                      Fin: obtenerFechaActual(),
                    },
                  },
                  Etapa: 1,
                }))
              : []),
          ],
          Fechas: {
            Plan: { Inicio: obtenerFechaActual(), Fin: obtenerFechaActual() },
            Ejecucion: {
              Inicio: obtenerFechaActual(),
              Fin: obtenerFechaActual(),
            },
          },
        };
      }),
      Fechas: {
        Plan: {
          Inicio: fecha_de_inicio,
          Fin: fecha_de_fin,
        },
        Ejecucion: {
          Inicio: obtenerFechaActual(),
          Fin: obtenerFechaActual(),
        },
      },
    }));
  };

  const crearEtapas = () => {
    return Array.from({ length: numEtapas }, (_, etapaIdx) => ({
      Nombre: `Etapa ${etapaIdx + 1}`,
      Partidas: crearPartidasGenerales(),
    }));
  };

  return {
    Nombre: nombre,
    Datos: {
      M2_Construccion: m2_construccion,
      M2_Vendibles: m2_vendibles,
      Direccion: direccion,
    },
    Sotanos: sotanos,
    Niveles: nivelesPorEdificio,
    Edificios: crearEdificios(nivelesPorEdificio),
    Fechas: {
      Plan: {
        Inicio: fecha_de_inicio,
        Fin: fecha_de_fin,
      },
      Ejecucion: {
        Inicio: fecha_de_inicio,
        Fin: fecha_de_fin,
      },
    },
    Etapas: crearEtapas(),
  };
};

console.log("-------------URBANIA SERVER-----------------");
