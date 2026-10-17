import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la categoría es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().max(255, "La descripción no puede exceder 255 caracteres").optional(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.string().uuid("Identificador de categoría inválido"),
});

export const categoryFilterSchema = z.object({
  name: z.string().optional(),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>;
export type CategoryFilterSchemaType = z.infer<typeof categoryFilterSchema>;
