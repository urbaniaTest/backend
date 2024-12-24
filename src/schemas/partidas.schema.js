const obtenerFechaActual = () => new Date().toISOString().split("T")[0];

export const partidas_fijas = [
  {
    Nombre: "Demolición",
    Subpartidas: [],
  },
  {
    Nombre: "Excavación",
    Subpartidas: [],
  },
  {
    Nombre: "Cimentación",
    Subpartidas: [
      "Cimentación profunda",
      "Recimentación",
      "Trabes y contra trabes",
    ],
  },
  {
    Nombre: "Semisótano",
    Subpartidas: [
      "Estructura",
      "Albañilerías",
      "Herrerías",
      "Impermeabilizante",
      "I. Eléctrica",
      "I. Hidrosanitaria",
      "I. Gas",
      "I. Especiales",
      "Pintura",
      "Cerámico",
    ],
  },
  {
    Nombre: "PB. Área común",
    Subpartidas: [
      "Estructura",
      "Albañilerías",
      "Herrerías",
      "Impermeabilizante",
      "I. Eléctrica",
      "I. Hidrosanitaria",
      "I. Gas",
      "Acabados",
      "Pintura",
    ],
  },
  {
    Nombre: "Media tensión",
    Subpartidas: [],
  },
  {
    Nombre: "Equipamientos",
    Subpartidas: [
      "Muro verde",
      "Equipo gym",
      "Piso gym",
      "A. Vehicular",
      "A. Peatonal",
      "Interfon",
      "CCTV",
      "Equipo de bombeo",
      "Salva escalera",
      "Eleva autos",
      "Pasto sintético",
      "Logo luminoso",
      "Señalización",
      "Mobiliario",
      "Juego infantil",
      "Elevadores",
      "Jardineras",
      "Planta tratamiento",
      "Malla ciclónica",
    ],
  },
  {
    Nombre: "Sacmex",
    Subpartidas: [],
  },
];

export const partidas_dinamicas = [
  {
    Nombre: "Sótano",
    Subpartidas: [
      "Estructura",
      "Albañilerías",
      "Herrerías",
      "Impermeabilizante",
      "I. Eléctrica",
      "I. Hidrosanitaria",
      "I. Gas",
      "I. Especiales",
      "Pintura",
      "Cerámico",
    ],
  },
];

export const partidas_edificios = [
  {
    Nombre: "Estructura",
    Subpartidas: ["Planta baja", "Azotea", "Tinaqueras"],
  },
  {
    Nombre: "Albañilerías",
    Subpartidas: ["Planta Baja", "Azotea", "Tinaqueras"],
  },
  {
    Nombre: "Herrería",
    Subpartidas: ["Planta Baja", "Azotea", "Tinaqueras"],
  },
  {
    Nombre: "Aplanados",
    Subpartidas: [
      {
        Nombre: "Pasillos",
        Fechas: {
          Plan: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
          Ejecución: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
        },
        Etapa: 1,
      },
      {
        Nombre: "Escaleras",
        Fechas: {
          Plan: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
          Ejecución: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
        },
        Etapa: 1,
      },
      {
        Nombre: "Roof Garden",
        Fechas: {
          Plan: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
          Ejecución: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
        },
        Etapa: 1,
      },
      {
        Nombre: "Fachadas",
        Fechas: {
          Plan: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
          Ejecución: {
            Inicio: obtenerFechaActual(),
            Fin: obtenerFechaActual(),
          },
        },
        Etapa: 1,
      },
    ],
  },
  {
    Nombre: "I. Eléctrica",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "I. Hidrosanitaria",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "I. Gas",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Cerámica",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Yesos",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Tablaroca",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Tirol",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Puertas",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Cocinas y closets",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Muebles de baño",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Cancelerías",
    Subpartidas: ["Planta Baja", "Azotea"],
  },
  {
    Nombre: "Impearmeabilizante",
    Subpartidas: ["Planta Baja", "Roof Garden"],
  },
  {
    Nombre: "Limpiezas",
    Subpartidas: ["Planta Baja", "Roof Garden"],
  },
];
