import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Escribe tu correo." })
    .email({ message: "Revisa el formato del correo." }),
  password: z
    .string()
    .min(1, { message: "Escribe tu contraseña." }),
  rememberMe: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
