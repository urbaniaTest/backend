import { crearProyecto } from "../libs/new_proyect_funtion";

export const new_proyect = async (req, res) => {
  try {
    const { etapas, edificios, niveles, sotanos } = req.body;
    res.status(201).json(crearProyecto(etapas, edificios, niveles, sotanos));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la obra", error });
  }
};
