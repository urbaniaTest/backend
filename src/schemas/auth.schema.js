import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "Email es requerido",
    })
    .email({
      message: "Email no es válido",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  nombre: z
    .string({
      required_error: "Nombre es requerido",
    })
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    }),
  apellido: z
    .string({
      required_error: "Apellido es requerido",
    })
    .min(2, {
      message: "El apellido debe tener al menos 2 caracteres",
    }),
  perfil: z.string({
    required_error: "Perfil es requerido",
  }),
  vista_de_obra: z.string({
    required_error: "Vista de obra es requerida",
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
