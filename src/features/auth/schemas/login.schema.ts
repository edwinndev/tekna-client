import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Escribe tu correo electrónico." })
    .email({ message: "El usuario debe ser un correo electrónico válido." }),
  password: z
    .string()
    .min(1, { message: "Escribe tu contraseña." }),
  rememberMe: z.boolean().default(false),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;
