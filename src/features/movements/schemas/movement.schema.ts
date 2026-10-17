import { z } from "zod";

export const movementTypeSchema = z.enum(["ENTRY", "EXIT"]);

export const createMovementSchema = z.object({
  productId: z.string().uuid("Debe seleccionar un producto válido"),
  supplierId: z.string().uuid("Identificador de proveedor inválido").optional(),
  movementType: movementTypeSchema,
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad mínima debe ser 1"),
  unitPrice: z
    .number()
    .nonnegative("El precio unitario no puede ser negativo")
    .optional(),
  documentNumber: z
    .string()
    .max(100, "El número de documento no puede exceder 100 caracteres")
    .optional(),
  reason: z
    .string()
    .max(255, "El motivo no puede exceder 255 caracteres")
    .optional(),
});

export const movementFilterSchema = z.object({
  productId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  movementType: movementTypeSchema.optional(),
  documentNumber: z.string().optional(),
});

export type CreateMovementSchemaType = z.infer<typeof createMovementSchema>;
export type MovementFilterSchemaType = z.infer<typeof movementFilterSchema>;
